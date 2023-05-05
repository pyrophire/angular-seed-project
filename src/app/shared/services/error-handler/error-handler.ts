import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';

import { environment } from '@environments/environment';
import { ErrorNotificationService } from './error-notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private ngZone: NgZone) {}

  handleError(error: Error | HttpErrorResponse | Event): void {
    // display alert
    if (error instanceof Error || error instanceof HttpErrorResponse) {
      // const loggingService = this.injector.get(LoggingService);
      const errorNotificationService = this.injector.get(ErrorNotificationService);
      if (environment.local || environment.prefix === 'dev-') {
        console.error(error);
      }

      this.ngZone.run(() => {
        errorNotificationService.showErrorDialog();
      });

      if (navigator.onLine) {
        // const slansModel = loggingService.errorToSlansMapper(error);
        // log unhandled errors
        // loggingService.log(slansModel.feature, slansModel.action, slansModel.details, SlansSeverity.NonFatalError);
      }
    }
  }
}
