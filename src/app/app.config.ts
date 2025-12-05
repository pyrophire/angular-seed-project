import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NoPreloading, provideRouter, withPreloading } from '@angular/router';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideIxIcons } from '@pyrophire/ix-libs';
import { routes } from './app.routes';
import { httpInterceptorProviders } from './interceptors';

// Initialize Material Icon Registry
function initializeIconRegistry(iconRegistry: MatIconRegistry) {
    return () => {
        iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    };
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withPreloading(NoPreloading)),
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        httpInterceptorProviders,
        provideHotToastConfig(),
        provideIxIcons(),
        {
            provide: APP_INITIALIZER,
            useFactory: initializeIconRegistry,
            deps: [MatIconRegistry],
            multi: true
        },
        {
            provide: OVERLAY_DEFAULT_CONFIG,
            useValue: {
                usePopover: false
            }
        }
    ]
};
