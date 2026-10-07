import { TestBed } from '@angular/core/testing';
import { TfIconComponent } from './tf-icon.component';

describe('TfIconComponent', () => {
    /** Renders the component for a value and returns its icon element. */
    const renderIcon = async (value: boolean): Promise<HTMLElement> => {
        const fixture = TestBed.createComponent(TfIconComponent);
        fixture.componentRef.setInput('data', value);
        await fixture.whenStable();
        return fixture.nativeElement.querySelector('mat-icon');
    };

    it('shows a checked icon for true', async () => {
        const icon = await renderIcon(true);
        expect(icon.textContent.trim()).toBe('check_circle');
        expect(icon.classList.contains('checked')).toBe(true);
    });

    it('shows an unchecked icon for false', async () => {
        const icon = await renderIcon(false);
        expect(icon.textContent.trim()).toBe('highlight_off');
        expect(icon.classList.contains('unchecked')).toBe(true);
    });
});
