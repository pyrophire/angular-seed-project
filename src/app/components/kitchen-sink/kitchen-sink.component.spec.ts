import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { environment } from '@environments/environment';
import { ToastService } from '@services/util/toast.service';
import { appConfig } from '../../app.config';
import { KitchenSinkComponent } from './kitchen-sink.component';

/**
 * Smoke test for the third-party libraries the seed depends on.
 * The exact pipe and formatter outputs are asserted on purpose: a library upgrade that changes
 * one of them should fail here, where it is cheap to notice.
 */
describe('KitchenSinkComponent', () => {
    let fixture: ComponentFixture<KitchenSinkComponent>;
    let element: HTMLElement;

    /** Trimmed text of the first element matching the selector, with whitespace collapsed. */
    const textOf = (selector: string): string => element.querySelector(selector).textContent.replace(/\s+/g, ' ').trim();

    beforeEach(async () => {
        sessionStorage.clear();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        TestBed.configureTestingModule({ imports: [KitchenSinkComponent], providers: [
                appConfig.providers,
                provideHttpClientTesting(),
                // jsdom never fires animation events, so a dialog would otherwise never finish closing.
                { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } }
            ]
        });
        fixture = TestBed.createComponent(KitchenSinkComponent);
        element = fixture.nativeElement;
        await fixture.whenStable();
    });

    afterEach(() => {
        // Dialogs render in the overlay container, outside the fixture.
        document.querySelectorAll('.cdk-overlay-container').forEach((container) => (container.innerHTML = ''));
        vi.restoreAllMocks();
    });

    it('renders every section', () => {
        const sections = Array.from(element.querySelectorAll<HTMLElement>('[data-section]')).map((section) => section.dataset['section']);
        expect(sections).toEqual([
            'theme',
            'material-buttons',
            'material-forms',
            'material-layout',
            'ng-select',
            'dialogs',
            'ix-libs',
            'utilities'
        ]);
    });

    describe('Angular Material', () => {
        it('renders the form controls with their values', () => {
            expect(element.querySelector<HTMLInputElement>('input[formControlName="text"]').value).toBe('Some text');
            expect(textOf('mat-select')).toBe('Dallas');
            expect(element.querySelector<HTMLInputElement>('input[formControlName="date"]').value).toBe('1/15/2026');
            expect(element.querySelector<HTMLInputElement>('mat-checkbox input').checked).toBe(true);
        });

        it('renders a table row per data row', () => {
            expect(element.querySelectorAll('tr[mat-row]')).toHaveLength(3);
            expect(textOf('tr[mat-header-row]')).toBe('Id Name Office Is Active');
        });
    });

    describe('ng-select', () => {
        it('renders all five controls', () => {
            expect(element.querySelectorAll('ng-select')).toHaveLength(5);
        });

        it('shows the selected value of the single select', () => {
            expect(textOf('ng-select[formControlName="single"] .ng-value-label')).toBe('Austin');
        });

        it('shows one chip per selected value of the multiple select', () => {
            const labels = Array.from(element.querySelectorAll('ng-select[formControlName="multiple"] .ng-value-label')).map((label) =>
                label.textContent.trim()
            );
            expect(labels).toEqual(['Dallas', 'Fort Worth']);
        });

        it('marks the disabled select and shows the required error', () => {
            expect(element.querySelector('ng-select[formControlName="disabled"]').classList.contains('ng-select-disabled')).toBe(true);
            expect(textOf('ix-ng-select-error')).toBe('A city is required');
        });
    });

    describe('@pyrophire/ix-libs', () => {
        it.each([
            ['.pipe-phone', '(512) 463-1158'],
            ['.pipe-filesize', '1.46 MB'],
            ['.pipe-ampm', '2:30 PM'],
            ['.pipe-c2t', 'Camel Case To Title']
        ])('%s renders %s', (selector, expected) => {
            expect(textOf(selector)).toBe(expected);
        });

        it('renders trusted HTML through the safe pipe', () => {
            expect(element.querySelector('.pipe-safe').innerHTML).toBe('<strong>Bold</strong> and <em>italic</em> through the safe pipe');
        });

        it('renders the theme button', () => {
            expect(element.querySelector('[data-section="theme"] ix-theme-button')).not.toBeNull();
        });
    });

    describe('utility libraries', () => {
        it.each([
            ['.date-format', 'Thursday, January 15th 2026, 2:30 PM'],
            ['.date-distance', 'in 3 days'],
            ['.jwt-decoded', '{ "unique_name": "sample.user", "role": "admin", "exp": 1893456000 }'],
            ['.ngx-order', '[ "alpha", "bravo", "charlie", "delta" ]'],
            ['.ngx-ucwords', 'Kitchen Sink Page'],
            ['.ngx-slugify', 'kitchen-sink-page']
        ])('%s renders %s', (selector, expected) => {
            expect(textOf(selector)).toBe(expected);
        });
    });

    describe('dialogs, toasts, and HTTP', () => {
        it.each(['success', 'error', 'warning', 'info', 'loading'] as const)('shows a %s toast', (kind) => {
            const toast = vi.spyOn(TestBed.inject(ToastService), kind).mockImplementation(() => undefined);
            element.querySelector<HTMLButtonElement>(`.toast-${kind}`).click();
            expect(toast).toHaveBeenCalledWith(`This is a ${kind} toast`);
        });

        it('opens the confirm dialog and records the answer', async () => {
            element.querySelector<HTMLButtonElement>('.open-confirm').click();
            await fixture.whenStable();
            expect(document.querySelector('mat-dialog-container h1').textContent).toBe('Confirm dialog');

            document.querySelector<HTMLButtonElement>('mat-dialog-container .ok-button').click();
            await fixture.whenStable();
            expect(textOf('.confirm-result')).toBe('Confirm result: true');
        });

        it('opens the error dialog', async () => {
            element.querySelector<HTMLButtonElement>('.open-error').click();
            await fixture.whenStable();
            expect(document.querySelector('mat-dialog-container .error-message').textContent).toBe('This is what an error looks like.');
        });

        it('sends the sample API call through the interceptors and reports a failure once', async () => {
            const httpTesting = TestBed.inject(HttpTestingController);
            element.querySelector<HTMLButtonElement>('.call-api').click();

            httpTesting
                .expectOne(`${environment.baseUrl}/authenticate/credentials`)
                .flush({ message: 'No such credentials' }, { status: 401, statusText: 'Unauthorized' });
            await fixture.whenStable();

            expect(textOf('.api-status')).toBe('API status: Failed with status 401');
            expect(document.querySelectorAll('mat-dialog-container')).toHaveLength(1);
            expect(document.querySelector('mat-dialog-container .error-message').textContent).toBe('No such credentials');
            httpTesting.verify();
        });
    });
});
