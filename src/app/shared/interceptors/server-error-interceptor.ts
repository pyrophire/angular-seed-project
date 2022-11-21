import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ErrorNotificationService } from '@services/error-handler/error-notification.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, map, retryWhen } from 'rxjs/operators';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  // For service request, try up to 2 times, with 2 second delay
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
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
        const errorNotificationService = this.injector.get(
          ErrorNotificationService
        );
        errorNotificationService.showErrorDialog('Error', error?.message);
        return throwError(error);
      })
    );
  }
}
