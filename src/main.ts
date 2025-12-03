import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [provideZoneChangeDetection(), ...(appConfig.providers || [])]
}).catch((err) => console.error(err));

// Globally silence console logs in production while keeping warnings/errors
if (environment.displayConsoleLogs) {
    try {
        enableProdMode();
    } catch {}
    const noop = () => undefined;
    const methods: Array<keyof Console> = ['log', 'debug', 'info', 'trace'];
    methods.forEach((m) => {
        try {
            (console as any)[m] = noop;
        } catch {
            /* no-op */
        }
    });
}
