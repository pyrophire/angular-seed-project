import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule, Routes } from '@angular/router';
import { environment } from '@environments/environment';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then((c) => c.HomeComponent),
    data: { breadcrumb: { label: 'Home' } }
  },
  // { path: 'license', loadChildren: () => import('./modules/license/license.module').then((m) => m.LicenseModule) },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: `reload`,
      enableTracing: false,
      preloadingStrategy: NoPreloading
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
    if (environment.envName === 'dev' || environment.envName === 'local') {
    }
  }
}
