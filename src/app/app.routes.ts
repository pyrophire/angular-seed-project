import { Routes } from '@angular/router';
import { DocsShellComponent } from './components/docs/docs-shell.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then((c) => c.HomeComponent),
        title: 'CHANGEME - Home'
    },
    {
        path: 'docs',
        component: DocsShellComponent,
        children: [
            {
                path: '',
                loadComponent: () => import('@pyrophire/ix-libs').then((m) => m.DocLandingComponent)
            },
            {
                path: '**',
                loadComponent: () => import('@pyrophire/ix-libs').then((m) => m.DocViewerComponent)
            }
        ]
    },

    {
        path: '**',
        redirectTo: '/home'
    }
];
