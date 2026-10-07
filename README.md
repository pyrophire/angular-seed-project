# Eli's Kinda Ok Angular Seed Project

An Angular 22 seed project: standalone components, zoneless change detection, functional HTTP interceptors with JWT support, a Material 3 theme with light and dark modes, and Vitest unit tests.

## ✨ Latest Updates

**🧪 Angular 22 Modernization (October 2026)**
- Material 3 theme through `mat.theme`; colors come from `--mat-sys-*` system variables
- Standalone bootstrap restored (`bootstrapApplication` + `app.config.ts`); `AppModule` removed
- Zoneless: `zone.js` removed
- Functional HTTP interceptors, including a working JWT interceptor
- Vitest replaces Karma/Jasmine

**🎯 Standalone Components Migration (November 2025)**
- Fully migrated to Angular standalone components (no NgModules)
- Modern bootstrap process using `bootstrapApplication`
- Improved tree-shaking and bundle optimization
- Simplified component dependencies with explicit imports
- See [CHANGELOG.md](./CHANGELOG.md) for detailed migration notes

## Features

- **Modern Angular**: standalone components, zoneless, OnPush, signals, `inject()`
- **HTTP interceptors**: request defaults, error dialog with retry for transient failures, and JWT with automatic re-authentication
- **Material 3 theme**: one palette drives light and dark modes through `--mat-sys-*` system variables
- **Environment toggles**: scroll-to-top button, scroll progress bar, and footer switched per environment
- **Docs viewer**: Markdown under `src/assets/markdown` is served at `/docs` through `@pyrophire/ix-libs`
- **Unit tests**: Vitest through the Angular `unit-test` builder
- **CI/CD**: GitHub Actions workflows for dev, test, and prod build and deploy
- **Path aliases**: `@common`, `@services`, `@models`, `@environments`, and more

## Setup

1. Clone Repository
2. Search and replace all instances of `CHANGEME` with your own project name (no-spaces)
3. Run `npm install`
4. Run `ng s`
5. Open browser to http://localhost:4200

## Project Structure

```
src/
├── environments/            # environment.ts plus dev / test / prod replacements
├── assets/
│   ├── img/                 # Favicons and touch icons
│   └── markdown/            # Content for the /docs viewer
├── styles/
│   ├── _themes.scss         # Material 3 theme (palette, typography, density)
│   ├── _vars.scss           # Layout sizes and breakpoints
│   ├── _colors/             # Palettes
│   ├── _partials/           # Mixins grouped by concern
│   └── _vendor/             # Styles for third-party widgets
├── styles.scss              # Global styles
├── third-party.scss         # Vendor CSS, loaded as a separate non-blocking file
└── app/
    ├── app.config.ts        # Application providers
    ├── app.routes.ts        # Route definitions
    ├── app.component.ts     # Root component
    ├── material-imports.ts  # Array of all Material modules
    ├── shared-imports.ts    # Array of commonly used imports
    ├── components/
    │   ├── common/          # confirm-dialog, error-dialog, footer, navigation, ng-select-error, tf-icon
    │   ├── docs/            # Shell for the /docs routes
    │   ├── kitchen-sink/    # Renders every third-party library; used to check npm upgrades
    │   └── home/            # Example page
    ├── interceptors/        # Functional HTTP interceptors
    ├── models/              # Data models and interfaces
    ├── services/
    │   ├── error-handler/   # Error dialog service, global handler, HTTP error message reader
    │   ├── jwt/             # Token request, storage, and resolution
    │   └── util/            # Toast, session storage, forms, query strings
    └── testing/             # Helpers shared by spec files
```

## Architecture Overview

This project uses **Angular Standalone Components** architecture:

### Core Files

- **`app.config.ts`**: Application-level configuration and providers (replaces AppModule)
- **`app.routes.ts`**: Route definitions (replaces routing modules)
- **`main.ts`**: Bootstrap entry point using `bootstrapApplication()`

### Component Structure

All components are standalone and explicitly declare their dependencies:

```typescript
@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, ...]
})
export class ExampleComponent {
  private readonly api = inject(ApiService);
  readonly title = input.required<string>();
}
```

The app is **zoneless**: `zone.js` is not loaded. Keep template state in signals so views update.

### Import Helpers

- **`material-imports.ts`**: Export array of all Material Design modules
- **`shared-imports.ts`**: Export array of commonly used modules

Usage:
```typescript
import { SHARED_IMPORTS } from '@app/shared-imports';

@Component({
  imports: [...SHARED_IMPORTS]
})
```

### HTTP Interceptors

Interceptors are functional and are registered once, in `app.config.ts`:

```typescript
provideHttpClient(withInterceptors(httpInterceptors))
```

`httpInterceptors` is exported from `src/app/interceptors/index.ts`, in outside-in order:

| Interceptor | What it does |
| --- | --- |
| `customHttpInterceptor` | Defaults API calls to `application/json` (never for `FormData`/`Blob` bodies), applies `withCredentials` when `environment.useWinAuth` is on, and sends RPNS calls as `text/plain` |
| `serverErrorInterceptor` | Retries GET/HEAD/OPTIONS once on status 0/502/503/504, shows the error dialog once, and rethrows the original `HttpErrorResponse` |
| `jwtInterceptor` | Attaches the bearer token, shares one authenticate call between concurrent requests, and on a 401 re-authenticates and replays the request once |

Rules that keep the chain working:

- Never import `HttpClientModule`, in `SHARED_IMPORTS` or anywhere else. A component that imports it gets a private `HttpClient` that skips every interceptor.
- Never register class interceptors on `HTTP_INTERCEPTORS`. They are ignored without an error.
- Not using JWT? Remove `jwtInterceptor` from the array in `interceptors/index.ts`.
- To show a failed request's message yourself, use `extractHttpErrorMessage(error)` from `@services/error-handler/http-error-message`. It understands TransactionResult, ASP.NET Core ProblemDetails, and older ASP.NET Web API error bodies.
- `HttpClient` uses the fetch backend. Add `withXhr()` to `provideHttpClient` if an app needs upload progress events.
- The support line under the error dialog comes from `environment.supportMessage`.

## Environment Configuration

`src/environments/environment.ts` is used for local development. `angular.json` swaps in `environment.dev.ts`, `environment.test.ts`, or `environment.prod.ts` for the `dev`, `test`, and `prod` build configurations.

| Setting | Purpose |
| --- | --- |
| `production` | Marks a deployed build |
| `displayConsoleLogs` | When false, `console.log`, `debug`, `info`, and `trace` are silenced; warnings and errors still show |
| `envName`, `prefix` | Environment label and hostname prefix |
| `baseUrl` | API root. Requests whose URL contains `/api` receive the JWT |
| `globalScrollButton` | Shows the floating scroll-to-top button |
| `globalScrollPosition` | Shows the scroll progress bar |
| `globalFooter` | Shows the footer. Also set `$footerHeight` in `_vars.scss` |
| `tokenCreds` | Application credentials posted to `/authenticate/credentials` to obtain a JWT |
| `useWinAuth` | Sends credentials (`withCredentials`) on API calls for Windows authentication |
| `storageKey` | Session storage key for the JWT |
| `supportMessage` | Contact line shown under every error dialog |
| `slansAppName` | Application name used by SLANS |

## Styling System

### Theme

`src/styles/_themes.scss` defines one Material 3 theme with `mat.theme(...)`. It emits the `--mat-sys-*` system variables for color, typography, elevation, shape, and state. Every color is a `light-dark()` pair, so the `.light` and `.dark` classes on `<body>` only need to set `color-scheme`. The ix-libs theme button toggles those classes.

To rebrand, change the `primary` palette in `_themes.scss`. Palettes live in `src/styles/_colors/_custom-palette.scss`.

### Colors in your own styles

Use the system variables, not Sass color variables. They follow the theme and switch with the mode automatically, so no `.dark` overrides are needed.

| Use | Variable |
| --- | --- |
| Brand color / text on it | `--mat-sys-primary` / `--mat-sys-on-primary` |
| Accent | `--mat-sys-secondary` |
| Errors and warnings | `--mat-sys-error` |
| Page and panel backgrounds | `--mat-sys-surface`, `--mat-sys-surface-container-low` … `-highest` |
| Text / secondary text | `--mat-sys-on-surface` / `--mat-sys-on-surface-variant` |
| Borders and dividers | `--mat-sys-outline` / `--mat-sys-outline-variant` |

```scss
.panel {
    background: var(--mat-sys-surface-container);
    color: var(--mat-sys-on-surface);
    border: 1px solid var(--mat-sys-outline-variant);
}

// A system variable cannot go through Sass color functions. Use color-mix for transparency.
.overlay {
    background: color-mix(in srgb, var(--mat-sys-primary) 20%, transparent);
}
```

Full list: https://material.angular.dev/guide/system-variables

### Layout variables

`src/styles/_vars.scss` holds what the theme does not: header, navigation, and footer heights, the app container width, and the media-query breakpoints.

## Key Packages & Dependencies

- **Angular 22** with **Angular Material / CDK 22**
- **@pyrophire/ix-libs**: theme button, scroll button and progress bar, table, pipes, icons, docs viewer
- **@ngxpert/hot-toast**: toasts, wrapped by `ToastService`
- **@ng-select/ng-select**: select and autocomplete control
- **jwt-decode**, **date-fns**: token parsing and expiry checks
- **marked**: Markdown rendering for the docs viewer
- **Vitest + jsdom**: unit tests (`npm test`)
- **Prettier**: formatting

## Models & Interfaces

| Model | File | Purpose |
| --- | --- | --- |
| `NavItem` | `models/navItem.model.ts` | One entry in the top navigation; nests through `children` |
| `TransactionResult<T>` | `models/transaction.model.ts` | Standard API response wrapper (`success`, `message`, `results`) |
| `TLCJwtToken`, `JwtAuthenticationResponse` | `models/jwt-token.model.ts` | Decoded token claims and the authenticate response |
| `ErrorDialogData` | `models/error-dialog-data.model.ts` | Data passed to the error dialog |

## Components & Services

### Components (`components/common`)

- **NavigationComponent**: top bar and menu, built from the `navItems` array in the component
- **FooterComponent**: shown when `environment.globalFooter` is true
- **ErrorDialogComponent**: opened by the error interceptor; offers Close and Refresh page
- **ConfirmDialogComponent**: closes with `true` or `false`
- **TfIconComponent**: check or cross icon for a boolean
- **NgSelectErrorComponent**: wrapper for showing validation errors under an ng-select

The scroll-to-top button, scroll progress bar, and theme button come from `@pyrophire/ix-libs`.

### Services

- **ApiService**: example API calls that write results to the store
- **StoreService**: shared state held in signals
- **ToastService**: `success`, `error`, `warning`, `info`, `loading`
- **JwtService**, **TokenResolver**, **TokenStorageService**: request, share, and store the JWT
- **SessionStorageService**: session storage with an in-memory fallback
- **FormService**, **ParamBuilderService**: form label and query-string helpers
- **ErrorNotificationService**: opens the error dialog from code

### Optional, off by default

- **GlobalErrorHandler**: shows the error dialog for uncaught errors. Enable with `{ provide: ErrorHandler, useClass: GlobalErrorHandler }` in `app.config.ts`
- **LowerCaseUrlSerializer**: makes routes case-insensitive. Enable with `{ provide: UrlSerializer, useClass: LowerCaseUrlSerializer }`

## Customizing

* Replace `CHANGEME` everywhere with the project name
* Set `baseUrl`, `tokenCreds`, `storageKey`, and `supportMessage` in each environment file
* Edit `navItems` in `navigation.component.ts` for the menu
* Change the palette in `_themes.scss` to rebrand
* Remove `jwtInterceptor` from `interceptors/index.ts` if the app does not use JWT
* Add Markdown under `src/assets/markdown` to populate `/docs`

## NPM Commands

* `npm start` - Regenerate the docs manifest and serve on http://localhost:4200
* `npm run build` - Regenerate the docs manifest and build the `prod` configuration
* `npm test` - Run the Vitest unit tests
* `npm run docs:manifest` - Rebuild the manifest for `src/assets/markdown`
* `npm run update-all` - Update Angular CLI, core, Material, and RxJS
* `npm run fresh` - Delete `node_modules` and `package-lock.json`, then reinstall
  * Requires `rimraf`: `npm install -g rimraf`
* `npm run audit` - Run npm audit and write `reports/build-audit.html`
* `npm run license-checker` - Write the licenses of direct dependencies to `src/assets/license.json`
* `npm run mcp` - Start the Angular MCP server in `mcp/`

## Development Workflow

1. **Creating Components**: Components are standalone and OnPush by default, and are generated with a spec file
   ```bash
   ng generate component my-component
   ```

2. **Feature Development**: Use environment flags to toggle new features during development

3. **Adding Routes**: Edit `app.routes.ts` for route configuration
   ```typescript
   {
     path: 'feature',
     loadComponent: () => import('./components/feature/feature.component')
       .then(m => m.FeatureComponent)
   }
   ```

4. **Styling**: Change the palette in `_themes.scss` for theme changes, and use the `--mat-sys-*` variables for colors in component styles

5. **Testing**: `npm test` runs Vitest once in CI and in watch mode in a terminal. Only `*.spec.ts` files are picked up
   (not `*.test.ts`, because `environment.test.ts` is an environment file). Vitest globals (`describe`, `it`, `expect`, `vi`) need no import.
   ```typescript
   const fixture = TestBed.createComponent(MyComponent);
   fixture.componentRef.setInput('title', 'Hello');
   await fixture.whenStable();
   ```
   For anything that makes HTTP calls, use the real providers so the interceptors are exercised:
   ```typescript
   TestBed.configureTestingModule({ providers: [appConfig.providers, provideHttpClientTesting()] });
   ```

6. **Building**: Use `ng build` for production builds
   ```bash
   ng build --configuration prod
   ```

7. **Deployment**: Configure environment files for different deployment targets

## Kitchen Sink (library upgrade check)

`/kitchen-sink` renders every third-party library the seed depends on, on one page: Angular Material, ng-select, hot-toast, ix-libs, ngx-pipes, date-fns, jwt-decode, the dialogs, and a sample API call that runs the interceptors. It is lazy loaded and is not linked from the navigation.

The page exists only when running locally. Its route lives in `src/environments/local-routes.ts`, which the `dev`, `test`, and `prod` build configurations replace with the empty `local-routes.deployed.ts`, so the page and its code are absent from every deployed bundle. Add other local-only pages to the same file.

After upgrading npm packages:

1. Run `npm test`. `kitchen-sink.component.spec.ts` asserts the exact output of each pipe and formatter and that each control renders, so a library that changed behavior fails there.
2. Run `npm start`, open http://localhost:4200/kitchen-sink, and check every card in light and dark mode. Open the dropdowns, the datepicker, both dialogs, and each toast.
3. Click **Call the sample API**. With the placeholder `baseUrl` it fails; expect exactly one error dialog.

When a library is added to the seed, add a card for it to this page and an assertion to its spec.

## TypeScript Path Aliases

The project uses configured path aliases for cleaner imports:

```typescript
import { MyService } from '@services/my.service';
import { NavItem } from '@models/navItem.model';
import { NavigationComponent } from '@common/navigation/navigation.component';
import { environment } from '@environments/environment';
```

Available aliases:
- `@common/*` - Common/shared components
- `@services/*` - Application services
- `@models/*` - Data models and interfaces
- `@environments/*` - Environment configurations
- `@components/*` - All components
- `@shared-imports` - The `SHARED_IMPORTS` array
- `@constants/*`, `@pipes/*`, `@enums/*`, `@resolvers/*`, `@mocks/*` - Reserved; create the folder under `src/app` when needed

## License Management

`npm run license-checker` writes the license of every direct dependency to `src/assets/license.json`. The seed does not include a page that displays it.

## GitHub Actions Workflows

The project includes automated CI/CD pipelines using GitHub Actions:

### Available Workflows

#### 1. DEV Build and Deploy (`01-dev-build-and-deploy.yml`)
- **Trigger**: Push to `dev` branch or manual workflow dispatch
- **Runner**: Self-hosted runner group (Make sure to update to your team's runner)
- **Environment**: Development
- **Actions**:
  - Builds Angular application for development environment
  - Deploys using RXploder deployment system
  - Sends dependency reports to DepView API for security monitoring

### Workflow Features

- **Property Logging**: Displays build paths, deployment URLs, and configuration settings
- **Flexible Branching**: Manual dispatch allows building from any branch
- **Dependency Tracking**: Automatically reports npm dependencies for security analysis
- **Environment-Specific**: Uses environment variables for configuration management

### Required GitHub Variables

Configure these in your GitHub repository settings under **Settings → Secrets and variables → Actions**.

#### Environment Variables
Environment-specific variables configured per environment (dev/test/prod):

| Variable               | Description                           | Example Values                                                                           |
| ---------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `RXPLODER_BACKUP`      | Create backup before deployment       | `false` (dev/test), `true` (prod)                                                        |
| `RXPLODER_DEPLOY_URL`  | Target deployment URL for environment | `dev-appname.legis.texas.gov`, `test-appname.legis.texas.gov`, `appname.legis.texas.gov` |
| `RXPLODER_ENVIRONMENT` | Deployment environment identifier     | `Dev`, `Test`, `Prod`                                                                    |

#### Repository Variables
Global variables available across all environments:

| Variable                       | Description                              | Example Value    |
| ------------------------------ | ---------------------------------------- | ---------------- |
| `DEPVIEW_APP_NAME`             | Application name for dependency tracking | `AppName-Webapp` |
| `DEPVIEW_ENV`                  | Environment for dependency monitoring    | `dev`            |
| `RXPLODER_APPNAME`             | Application name for RXploder deployment | `AppName-webapp` |
| `RXPLODER_CLEAN`               | Clean deployment directory before deploy | `true`           |
| `RXPLODER_DEBUG`               | Enable debug mode during deployment      | `false`          |
| `RXPLODER_DEPLOY_PACKAGES_SRC` | Source path for deployment packages      | `\dist\browser`  |
| `RXPLODER_VERBOSE`             | Enable verbose logging during deployment | `true`           |

**Note**: Environment variables take precedence over repository variables when both are defined. Use environment variables for values that differ between dev/test/prod, and repository variables for values shared across all environments.

### Deployment Process

1. **Build Phase**: Compiles Angular application with environment-specific configuration
2. **Deploy Phase**: Uses RXploder system to deploy to target environment
3. **Monitoring Phase**: Reports dependencies to DepView for security analysis

## Troubleshooting

### Buffer / Uint8Array Type Errors After Updating to Angular 21
If you see errors like:

```
TS2430: Interface 'Buffer' incorrectly extends interface 'Uint8Array<ArrayBufferLike>'
TS2344: Type 'Buffer' does not satisfy the constraint 'ArrayBufferView'
```

They are caused by an older `@types/node` package (e.g. v20.x) being used with Node 22 / TypeScript 5.9, which tightened lib definitions. Fix:

1. Upgrade `@types/node` to a version matching your runtime (e.g. `^22.x`).
2. Optionally enable `"skipLibCheck": true` in `tsconfig.json` to avoid third‑party lib noise.
3. Reinstall and rebuild: `npm install && ng build`.

Already applied in this repo: `@types/node@^22.8.2` and `skipLibCheck` enabled.

### Production Build Configuration Not Found
If `ng build` errors with:
```
Configuration 'production' for target 'build' ... is not set in the workspace
```
This project names its production configuration `prod`, because the build pipeline passes that name, and `prod` is the default. Use `ng build` or `ng build --configuration prod`; there is no `production` configuration.

### MCP Server Method Not Found
If the MCP server logs `Method not found`, confirm you've updated to the SDK-based server and tool names (`angular_listComponents`, etc.). Restart VS Code after changes to `.vscode/mcp.json`.

### Common Fix Commands
```bash
npm install           # Ensure dependencies match package.json
ng build              # Verify browser build succeeds
ng serve --configuration dev  # Run development server explicitly
```

### When To Use skipLibCheck
Prefer fixing version mismatches first. Use `skipLibCheck` only to suppress non-app library declaration noise; avoid relying on it to hide real app type issues.
