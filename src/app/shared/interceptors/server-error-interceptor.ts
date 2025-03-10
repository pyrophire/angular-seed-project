import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorDialogComponent } from '@app/shared/components/error-dialog/error-dialog.component';
import { ToastService } from '@app/shared/services/util/toast.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, map, retryWhen } from 'rxjs/operators';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private toast: ToastService, private router: Router, private dialog: MatDialog) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((result) => result),

      retryWhen((error) => {
        return error.pipe(
          concatMap((e, i) => {
            if (i >= 1) {
              return throwError(e);
            }
            return of(e).pipe(delay(2000));
          })
        );
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = error.error.message || 'Bad request';
              break;
            case 401:
              errorMessage = 'You are not authorized to access this resource';
              // Optionally redirect to login
              // this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'You do not have permission to access this resource';
              break;
            case 404:
              errorMessage = 'Resource not found';
              break;
            case 409:
              errorMessage = error.error.message || 'Conflict with current state';
              break;
            case 422:
              errorMessage = error.error.message || 'Validation failed';
              break;
            case 500:
              errorMessage = 'Server error occurred. Please try again later.';
              break;
            case 503:
              errorMessage = 'Service unavailable. Please try again later.';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.error.message || error.statusText}`;
          }
        }

        // Show the error message to the user
        // this.toast.error(errorMessage);
        this.dialog.open(ErrorDialogComponent, {
          width: '400px',
          data: {
            title: 'Error',
            message: errorMessage,
            status: error.status
          },
          disableClose: true
        });

        // Log the error to console for debugging
        console.error('HTTP Error:', error);

        // Return a standardized error format
        return throwError(() => ({
          error: true,
          message: errorMessage,
          status: error.status,
          originalError: error
        }));
      })
    );
  }
}
