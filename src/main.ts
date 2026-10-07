import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

/**
 * Replaces the informational console methods with no-ops while leaving warnings and errors intact.
 */
function silenceConsoleLogs(): void {
    const noop = (): void => undefined;
    console.log = noop;
    console.debug = noop;
    console.info = noop;
    console.trace = noop;
}

if (!environment.displayConsoleLogs) {
    silenceConsoleLogs();
}

bootstrapApplication(AppComponent, appConfig).catch((err: unknown) => console.error(err));
