import { Routes } from '@angular/router';

/**
 * Routes that exist only when running locally (`ng serve` / the `local` build configuration).
 *
 * The `dev`, `test`, and `prod` build configurations replace this file with `local-routes.deployed.ts`,
 * which is empty, so these pages and their code are left out of every deployed bundle.
 */
export const localRoutes: Routes = [
    {
        // Renders every third-party library on one page. Open it after upgrading npm packages.
        path: 'kitchen-sink',
        loadComponent: () => import('../app/components/kitchen-sink/kitchen-sink.component').then((c) => c.KitchenSinkComponent),
        title: 'CHANGEME - Kitchen Sink'
    }
];
