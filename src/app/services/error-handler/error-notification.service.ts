import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '@common/error-dialog/error-dialog.component';
import { ErrorDialogData } from '@models/error-dialog-data.model';

export const enum DisplayMessages {
    ContactSupport = 'An error occurred',
    AccessDenied = 'Access denied',
    GenericException = 'An error occurred',
    NetworkAvailability = 'Network access is not available. Check your network connection.',
    NetworkUnavailable = 'Network unavailable',
    NotFound = 'Not Found',
    UnexpectedErrorOccurred = 'An unexpected error occurred',
    UpdateAlertError = 'Error occurred while updating alert settings for'
}

@Injectable({
    providedIn: 'root'
})
export class ErrorNotificationService {
    private readonly dialog = inject(MatDialog);

    /**
     * Opens the error dialog. Falls back to a generic title and message, or to a
     * network-unavailable message when the browser is offline and no message was given.
     *
     * @param title - Dialog title; defaults to a generic "unexpected error" title
     * @param message - Dialog body; defaults to a generic message
     */
    showErrorDialog(title?: string, message?: string): void {
        const isOffline = !message && !navigator.onLine;
        const data: ErrorDialogData = {
            title: isOffline ? DisplayMessages.NetworkUnavailable : title || DisplayMessages.UnexpectedErrorOccurred,
            message: isOffline ? DisplayMessages.NetworkAvailability : message || DisplayMessages.ContactSupport
        };
        this.dialog.open<ErrorDialogComponent, ErrorDialogData>(ErrorDialogComponent, { data });
    }
}
