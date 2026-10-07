import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '@common/error-dialog/error-dialog.component';
import { environment } from '@environments/environment';
import { ErrorDialogData } from '@models/error-dialog-data.model';
import { extractHttpErrorMessage } from '@services/error-handler/http-error-message';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

/** Statuses that indicate a transient failure worth one more attempt. */
const RETRYABLE_STATUSES: readonly number[] = [0, 502, 503, 504];
/** Only methods that are safe to repeat; a write must never be sent twice. */
const RETRYABLE_METHODS: readonly string[] = ['GET', 'HEAD', 'OPTIONS'];
const RETRY_DELAY_MS = 2000;

/**
 * Errors that have already been shown to the user.
 * A token request made on behalf of an API request travels through this interceptor twice
 * (once for itself, once as the failure of the outer request); this stops the second report.
 */
const reportedErrors = new WeakSet<HttpErrorResponse>();

/**
 * @param req - The request that failed
 * @param error - The failure
 * @returns True when the request can safely be attempted once more
 */
function isRetryable(req: HttpRequest<unknown>, error: unknown): boolean {
    return (
        error instanceof HttpErrorResponse &&
        !reportedErrors.has(error) &&
        RETRYABLE_STATUSES.includes(error.status) &&
        RETRYABLE_METHODS.includes(req.method)
    );
}

/**
 * Retries transient failures of read-only requests once, then shows the error dialog.
 *
 * The original `HttpErrorResponse` is rethrown unchanged so callers can still inspect
 * `status`, `error`, and `url`. Use `extractHttpErrorMessage` to get display text from it.
 *
 * @param req - The outgoing request
 * @param next - The next handler in the interceptor chain
 * @returns The response event stream
 */
export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const dialog = inject(MatDialog);

    return next(req).pipe(
        retry({
            count: 1,
            delay: (error: unknown): Observable<unknown> => (isRetryable(req, error) ? timer(RETRY_DELAY_MS) : throwError(() => error))
        }),
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && !reportedErrors.has(error)) {
                reportedErrors.add(error);
                console.error(`HTTP ${req.method} ${req.url} failed with status ${error.status}:`, error);
                dialog.open<ErrorDialogComponent, ErrorDialogData>(ErrorDialogComponent, {
                    width: '400px',
                    disableClose: true,
                    data: {
                        title: 'Error',
                        message: extractHttpErrorMessage(error),
                        supportMessage: environment.supportMessage,
                        status: error.status
                    }
                });
            }
            return throwError(() => error);
        })
    );
};
