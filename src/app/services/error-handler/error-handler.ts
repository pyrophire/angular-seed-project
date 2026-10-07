import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ErrorNotificationService } from './error-notification.service';

/**
 * Shows the error dialog for uncaught application errors.
 *
 * Not registered by default. To enable it, add to `app.config.ts`:
 * `{ provide: ErrorHandler, useClass: GlobalErrorHandler }`
 *
 * Failed HTTP requests are skipped because `serverErrorInterceptor` has already reported them.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private readonly errorNotificationService = inject(ErrorNotificationService);

    /**
     * @param error - The uncaught error
     */
    handleError(error: unknown): void {
        console.error(error);
        if (error instanceof Error && !(error instanceof HttpErrorResponse)) {
            this.errorNotificationService.showErrorDialog();
        }
    }
}
