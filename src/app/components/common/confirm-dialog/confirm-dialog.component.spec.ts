import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
    const dialogRef = { close: vi.fn() };

    /** Renders the dialog with the given data and returns its root element. */
    const render = async (data: ConfirmDialogData): Promise<HTMLElement> => {
        dialogRef.close.mockClear();
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: data }
            ]
        });
        const fixture = TestBed.createComponent(ConfirmDialogComponent);
        await fixture.whenStable();
        return fixture.nativeElement;
    };

    it('shows the title and message', async () => {
        const element = await render({ title: 'Delete item', message: 'This cannot be undone.' });
        expect(element.querySelector('h1').textContent).toBe('Delete item');
        expect(element.querySelector('.confirm-message').textContent.trim()).toBe('This cannot be undone.');
    });

    it('falls back to a default title', async () => {
        const element = await render({ message: 'Sure?' });
        expect(element.querySelector('h1').textContent).toBe('Confirm');
    });

    it('closes with true when confirmed', async () => {
        const element = await render({ message: 'Sure?' });
        element.querySelector<HTMLButtonElement>('.ok-button').click();
        expect(dialogRef.close).toHaveBeenCalledWith(true);
    });

    it('closes with false when cancelled', async () => {
        const element = await render({ message: 'Sure?' });
        element.querySelector<HTMLButtonElement>('.cancel-button').click();
        expect(dialogRef.close).toHaveBeenCalledWith(false);
    });
});
