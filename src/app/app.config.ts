import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NoPreloading, provideRouter, withPreloading } from '@angular/router';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideIxIcons } from '@pyrophire/ix-libs';
import { routes } from './app.routes';
import { httpInterceptorProviders } from './interceptors';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withPreloading(NoPreloading)),
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        httpInterceptorProviders,
        provideHotToastConfig(),
        provideIxIcons(),
        {
            provide: OVERLAY_DEFAULT_CONFIG,
            useValue: {
                usePopover: false
            }
        }
    ]
};
