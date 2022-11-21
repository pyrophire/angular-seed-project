import { Component, Inject, Injector, Type } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WindowsService } from '@services/error-handler/windows.service';

@Component({
  selector: 'app-error-dialog',
  templateUrl: 'error-dialog.component.html'
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private injector: Injector,
    private windowsService: WindowsService
  ) {
    this.dialogRef.disableClose = true;
  }

  close(): void {
    this.dialogRef.close();
  }

  refresh(): void {
    const router = this.injector.get<Router>(Router as Type<Router>);
    router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.windowsService.reloadWindow();

    this.dialogRef.close();
  }
}
