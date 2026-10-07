import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogData } from '@models/error-dialog-data.model';
import { WindowsService } from '@services/error-handler/windows.service';

@Component({
    selector: 'app-error-dialog',
    templateUrl: 'error-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogModule, MatButtonModule]
})
export class ErrorDialogComponent {
    private readonly dialogRef = inject<MatDialogRef<ErrorDialogComponent>>(MatDialogRef);
    private readonly windowsService = inject(WindowsService);
    protected readonly data = inject<ErrorDialogData>(MAT_DIALOG_DATA);

    constructor() {
        this.dialogRef.disableClose = true;
    }

    /**
     * Dismisses the dialog.
     */
    close(): void {
        this.dialogRef.close();
    }

    /**
     * Reloads the whole page so the app restarts from a clean state.
     */
    refresh(): void {
        this.dialogRef.close();
        this.windowsService.reloadWindow();
    }
}
