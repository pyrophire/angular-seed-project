import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorDialogData } from '@models/error-dialog-data.model';
import { WindowsService } from '@services/error-handler/windows.service';
import { ErrorDialogComponent } from './error-dialog.component';

describe('ErrorDialogComponent', () => {
    const dialogRef = { close: vi.fn(), disableClose: false };
    const windowsService = { reloadWindow: vi.fn() };

    /** Renders the dialog with the given data and returns its root element. */
    const render = async (data: ErrorDialogData): Promise<HTMLElement> => {
        dialogRef.close.mockClear();
        windowsService.reloadWindow.mockClear();
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: WindowsService, useValue: windowsService }
            ]
        });
        const fixture = TestBed.createComponent(ErrorDialogComponent);
        await fixture.whenStable();
        return fixture.nativeElement;
    };

    it('shows the message and the support message as text', async () => {
        const element = await render({ title: 'Error', message: 'It <b>broke</b>', supportMessage: 'Call support.' });
        expect(element.querySelector('.error-message').textContent).toBe('It <b>broke</b>');
        expect(element.querySelector('.support-message').textContent).toBe('Call support.');
        expect(dialogRef.disableClose).toBe(true);
    });

    it('omits the support paragraph when no support message is given', async () => {
        const element = await render({ title: 'Error', message: 'It broke' });
        expect(element.querySelector('.support-message')).toBeNull();
    });

    it('closes without reloading on Close', async () => {
        const element = await render({ title: 'Error', message: 'It broke' });
        element.querySelector<HTMLButtonElement>('.close-button').click();
        expect(dialogRef.close).toHaveBeenCalledTimes(1);
        expect(windowsService.reloadWindow).not.toHaveBeenCalled();
    });

    it('reloads the page on Refresh', async () => {
        const element = await render({ title: 'Error', message: 'It broke' });
        element.querySelector<HTMLButtonElement>('.refresh-button').click();
        expect(windowsService.reloadWindow).toHaveBeenCalledTimes(1);
    });
});
