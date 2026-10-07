import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

/** Data accepted by `ConfirmDialogComponent`. */
export interface ConfirmDialogData {
    title?: string;
    message: string;
}

/**
 * Asks the user to confirm an action. Closes with `true` for Ok and `false` for Cancel.
 */
@Component({
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmDialogComponent {
    private readonly dialogRef = inject<MatDialogRef<ConfirmDialogComponent, boolean>>(MatDialogRef);
    protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

    /**
     * Closes the dialog as cancelled.
     */
    public close(): void {
        this.dialogRef.close(false);
    }

    /**
     * Closes the dialog as confirmed.
     */
    public ok(): void {
        this.dialogRef.close(true);
    }
}
