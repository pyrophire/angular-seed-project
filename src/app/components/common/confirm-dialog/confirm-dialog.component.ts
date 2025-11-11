import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss'],
    imports: [CommonModule],
    encapsulation: ViewEncapsulation.None,
    standalone: true
})
export class ConfirmDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
    ) {}

    public close() {
        this.dialogRef.close(false);
    }
    public ok() {
        this.dialogRef.close(true);
    }
    ngOnInit() {}
}
