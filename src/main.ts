import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '@environments/environment';
import { AppModule } from './app/app.module';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));

// Globally silence console logs in production while keeping warnings/errors
if (!environment.displayConsoleLogs) {
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
