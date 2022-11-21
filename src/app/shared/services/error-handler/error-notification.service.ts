import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '@shared/components/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ErrorNotificationService {
  constructor(private dialog: MatDialog) {}

  showErrorDialog(title?: string, message?: string): void {
    // Enable this if the errors only happen outside of a dialog
    // if (this.dialog.openDialogs && this.dialog.openDialogs.length > 0) {
    //   return;
    // }

    if (!title || title.length === 0) {
      title = DisplayMessages.UnexpectedErrorOccurred;
    }

    if (!message || message.length === 0) {
      message = DisplayMessages.ContactSupport;
      if (!navigator.onLine) {
        title = DisplayMessages.NetworkUnavailable;
        message = DisplayMessages.NetworkAvailability;
      }
    }

    this.dialog.open(ErrorDialogComponent, {
      data: {
        title,
        message,
      },
    });
  }
}
export const enum DisplayMessages {
  ContactSupport = 'An error occurred',
  AccessDenied = 'Access denied',
  GenericException = 'An error occurred',
  NetworkAvailability = 'Network access is not available. Check your network connection.',
  NetworkUnavailable = 'Network unavailable',
  NotFound = 'Not Found',
  UnexpectedErrorOccurred = 'An unexpected error occurred',
  UpdateAlertError = 'Error occurred while updating alert settings for',
}
