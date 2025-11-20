#!/usr/bin/env node
/**
 * MCP server for Angular workspace introspection.
 * Provides tools to explore Angular projects, components, services, and routes.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const WORKSPACE_ROOT = path.resolve(process.cwd());
const ANGULAR_JSON_PATH = path.join(WORKSPACE_ROOT, 'angular.json');

function safeReadFile(p: string) {
    const full = path.resolve(WORKSPACE_ROOT, p);
    if (!full.startsWith(WORKSPACE_ROOT)) {
        throw new Error('Path outside workspace');
    }
    const content = readFileSync(full, 'utf8');
    const MAX = 200_000; // char limit
    return content.length > MAX ? content.slice(0, MAX) + '\n/* TRUNCATED */\n' : content;
}

function loadAngularJson() {
    try {
        const raw = readFileSync(ANGULAR_JSON_PATH, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function listTsFiles(dir: string): string[] {
    const out: string[] = [];
    for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        try {
            const st = statSync(full);
            if (st.isDirectory()) {
                out.push(...listTsFiles(full));
            } else if (st.isFile() && entry.endsWith('.ts')) {
                out.push(full);
            }
        } catch {
            /* ignore */
        }
    }
    return out;
}

function classifyAngularArtifacts(files: string[]) {
    const components: { name: string; path: string }[] = [];
    const services: { name: string; path: string }[] = [];
    for (const f of files) {
        const base = path.basename(f);
        if (base.endsWith('.component.ts')) {
            components.push({ name: base.replace('.component.ts', ''), path: path.relative(WORKSPACE_ROOT, f) });
        } else if (base.endsWith('.service.ts')) {
            services.push({ name: base.replace('.service.ts', ''), path: path.relative(WORKSPACE_ROOT, f) });
        }
    }
    return { components, services };
}

function extractRoutes(fileContent: string) {
    // Heuristic: match objects like { path: 'xyz', component: SomeComponent }
    const routeRegex = /\{[^}]*path\s*:\s*['\"]([^'\"]+)['\"][^}]*component\s*:\s*([A-Za-z0-9_]+)/g;
    const routes: { path: string; component: string }[] = [];
    let m: RegExpExecArray | null;
    while ((m = routeRegex.exec(fileContent))) {
        routes.push({ path: m[1], component: m[2] });
    }
    return routes;
}

async function handle(method: string, params: any, id: any) {
    switch (method) {
        case 'angular_projectInfo': {
            const aj = loadAngularJson();
            if (!aj) throw new Error('angular.json not found');
            const projects = Object.keys(aj.projects || {});
            return { projects };
        }
        case 'angular_listComponents':
        case 'angular_listServices': {
            const project = params?.project; // optional
            const aj = loadAngularJson();
            if (!aj) throw new Error('angular.json not found');
            const targets: string[] = [];
            const projectNames = project ? [project] : Object.keys(aj.projects || {});
            for (const pName of projectNames) {
                const p = aj.projects[pName];
                if (!p) continue;
                const srcRoot: string = p.sourceRoot || 'src';
                const appDir = path.join(WORKSPACE_ROOT, srcRoot, 'app');
                try {
                    targets.push(...listTsFiles(appDir));
                } catch {
                    /* ignore */
                }
            }
            const { components, services } = classifyAngularArtifacts(targets);
            return method === 'angular_listComponents' ? components : services;
        }
        case 'angular_listRoutes': {
            const project = params?.project;
            const aj = loadAngularJson();
            if (!aj) throw new Error('angular.json not found');
            const projectNames = project ? [project] : Object.keys(aj.projects || {});
            const allRoutes: any[] = [];
            for (const pName of projectNames) {
                const p = aj.projects[pName];
                if (!p) continue;
                const srcRoot: string = p.sourceRoot || 'src';
                const routesFile = path.join(WORKSPACE_ROOT, srcRoot, 'app', 'app.routes.ts');
                try {
                    const content = readFileSync(routesFile, 'utf8');
                    const routes = extractRoutes(content).map((r) => ({ ...r, project: pName }));
                    allRoutes.push(...routes);
                } catch {
                    /* Try old routing module format */
                    try {
                        const routingFile = path.join(WORKSPACE_ROOT, srcRoot, 'app', 'app-routing.module.ts');
                        const content = readFileSync(routingFile, 'utf8');
                        const routes = extractRoutes(content).map((r) => ({ ...r, project: pName }));
                        allRoutes.push(...routes);
                    } catch {
                        /* ignore */
                    }
                }
            }
            return allRoutes;
        }
        case 'angular_readFile': {
            const relPath = params?.path;
            if (!relPath || typeof relPath !== 'string') throw new Error('path required');
            const content = safeReadFile(relPath);
            return { path: relPath, content };
        }
        default:
            throw new Error('Method not found');
    }
}

const server = new Server(
    {
        name: 'angular-workspace',
        version: '1.0.0'
    },
    {
        capabilities: {
            tools: {}
        }
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'angular_projectInfo',
                description: 'Get information about Angular projects in the workspace',
                inputSchema: {
                    type: 'object',
                    properties: {}
                }
            },
            {
                name: 'angular_listComponents',
                description: 'List all Angular components in the workspace',
                inputSchema: {
                    type: 'object',
                    properties: {
                        project: {
                            type: 'string',
                            description: 'Optional: specific project name to list components from'
                        }
                    }
                }
            },
            {
                name: 'angular_listServices',
                description: 'List all Angular services in the workspace',
                inputSchema: {
                    type: 'object',
                    properties: {
                        project: {
                            type: 'string',
                            description: 'Optional: specific project name to list services from'
                        }
                    }
                }
            },
            {
                name: 'angular_listRoutes',
                description: 'List all routes defined in the Angular application',
                inputSchema: {
                    type: 'object',
                    properties: {
                        project: {
                            type: 'string',
                            description: 'Optional: specific project name to list routes from'
                        }
                    }
                }
            },
            {
                name: 'angular_readFile',
                description: 'Read a file from the workspace',
                inputSchema: {
                    type: 'object',
                    properties: {
                        path: {
                            type: 'string',
                            description: 'Relative path to the file to read'
                        }
                    },
                    required: ['path']
                }
            }
        ]
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const result = await handle(request.params.name, request.params.arguments, null);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(result, null, 2)
                }
            ]
        };
    } catch (error: any) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error.message}`
                }
            ],
            isError: true
        };
    }
});

async function start() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

start().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
