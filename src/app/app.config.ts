import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter } from '@angular/router';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideIxIcons } from '@pyrophire/ix-libs';
import { routes } from './app.routes';
import { httpInterceptors } from './interceptors';

/**
 * Application-level providers. Replaces the former AppModule.
 *
 * HTTP interceptors are functional and are registered once, here, through `withInterceptors`.
 * Do not import `HttpClientModule` anywhere or register `HTTP_INTERCEPTORS` class providers:
 * both silently bypass this chain.
 */
export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(withInterceptors(httpInterceptors)),
        provideHotToastConfig(),
        provideIxIcons(),
        provideAppInitializer(() => {
            inject(MatIconRegistry).setDefaultFontSetClass('material-symbols-outlined');
        }),
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                disableClose: true,
                hasBackdrop: true,
                maxHeight: '90dvh'
            }
        },
        {
            provide: OVERLAY_DEFAULT_CONFIG,
            useValue: {
                usePopover: false
            }
        }
    ]
};
