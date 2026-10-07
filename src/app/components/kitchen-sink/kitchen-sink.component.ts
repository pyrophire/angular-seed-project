import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '@common/confirm-dialog/confirm-dialog.component';
import { NgSelectErrorComponent } from '@common/ng-select-error/ng-select-error.component';
import { TfIconComponent } from '@common/tf-icon/tf-icon.component';
import { ApiService } from '@services/api.service';
import { ErrorNotificationService } from '@services/error-handler/error-notification.service';
import { ToastService } from '@services/util/toast.service';
import { SHARED_IMPORTS } from '@shared-imports';
import { addDays, format, formatDistance } from 'date-fns';
import { jwtDecode } from 'jwt-decode';

/** One option in the sample select controls. */
interface SampleOption {
    id: number;
    name: string;
    group: string;
    /** Named `disabled` because ng-select reads that property to disable an item. */
    disabled?: boolean;
}

/** One row in the sample tables. */
interface SampleRow {
    id: number;
    name: string;
    office: string;
    isActive: boolean;
}

/** Toast types the page can trigger. */
type ToastKind = 'success' | 'error' | 'warning' | 'info' | 'loading';

/** A fixed date so the page renders the same output on every run. */
const SAMPLE_DATE = new Date(2026, 0, 15, 14, 30);
/** Unsigned token with the payload `{ "unique_name": "sample.user", "role": "admin", "exp": 1893456000 }`. */
const SAMPLE_JWT = 'eyJhbGciOiJub25lIn0.eyJ1bmlxdWVfbmFtZSI6InNhbXBsZS51c2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxODkzNDU2MDAwfQ.signature';

/**
 * Renders every third-party library the seed depends on, on one page.
 *
 * Open `/kitchen-sink` after upgrading npm packages and check each section in light and dark mode.
 * When a new library is added to the seed, add a section for it here.
 */
@Component({
    selector: 'CHANGEME-kitchen-sink',
    templateUrl: './kitchen-sink.component.html',
    styleUrl: './kitchen-sink.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideNativeDateAdapter()],
    imports: [...SHARED_IMPORTS, NgSelectErrorComponent, TfIconComponent]
})
export class KitchenSinkComponent {
    private readonly dialog = inject(MatDialog);
    private readonly toast = inject(ToastService);
    private readonly errorNotification = inject(ErrorNotificationService);
    private readonly api = inject(ApiService);

    protected readonly options: SampleOption[] = [
        { id: 1, name: 'Austin', group: 'Central' },
        { id: 2, name: 'Dallas', group: 'North' },
        { id: 3, name: 'El Paso', group: 'West' },
        { id: 4, name: 'Fort Worth', group: 'North' },
        { id: 5, name: 'Houston', group: 'Gulf Coast', disabled: true },
        { id: 6, name: 'San Antonio', group: 'Central' }
    ];

    protected readonly rows: SampleRow[] = [
        { id: 3, name: 'Charlie', office: 'Dallas', isActive: true },
        { id: 1, name: 'alice', office: 'Austin', isActive: true },
        { id: 2, name: 'Bob', office: 'Houston', isActive: false }
    ];

    protected readonly materialTableColumns: (keyof SampleRow)[] = ['id', 'name', 'office', 'isActive'];

    protected readonly form = new FormGroup({
        text: new FormControl('Some text', { nonNullable: true }),
        matSelect: new FormControl<number | null>(2),
        date: new FormControl<Date | null>(SAMPLE_DATE),
        isChecked: new FormControl(true, { nonNullable: true }),
        isToggled: new FormControl(false, { nonNullable: true }),
        radio: new FormControl('b', { nonNullable: true }),
        single: new FormControl<number | null>(1),
        multiple: new FormControl<number[]>([2, 4], { nonNullable: true }),
        grouped: new FormControl<number | null>(null),
        required: new FormControl<number | null>(null, Validators.required),
        disabled: new FormControl<number | null>({ value: 3, disabled: true })
    });

    protected readonly sampleDate = SAMPLE_DATE;
    protected readonly formattedDate = format(SAMPLE_DATE, 'EEEE, MMMM do yyyy, h:mm a');
    protected readonly dateDistance = formatDistance(addDays(SAMPLE_DATE, 3), SAMPLE_DATE, { addSuffix: true });
    protected readonly decodedToken = jwtDecode<Record<string, unknown>>(SAMPLE_JWT);
    protected readonly safeHtml = '<strong>Bold</strong> and <em>italic</em> through the safe pipe';
    protected readonly words = ['delta', 'alpha', 'charlie', 'bravo'];

    /** Result of the most recent confirm dialog, or null before one has been answered. */
    protected readonly confirmResult = signal<boolean | null>(null);
    /** Outcome of the most recent sample API call. */
    protected readonly apiStatus = signal('Not called yet');

    constructor() {
        // Shows the validation message without the user having to touch the control first.
        this.form.controls.required.markAsTouched();
    }

    /**
     * Shows a toast of the given type.
     *
     * @param kind - The toast type to show
     */
    protected showToast(kind: ToastKind): void {
        this.toast[kind](`This is a ${kind} toast`);
    }

    /**
     * Opens the confirm dialog and records which button closed it.
     */
    protected openConfirmDialog(): void {
        this.dialog
            .open<ConfirmDialogComponent, ConfirmDialogData, boolean>(ConfirmDialogComponent, {
                data: { title: 'Confirm dialog', message: 'Does this dialog look right?' }
            })
            .afterClosed()
            .subscribe((isConfirmed) => this.confirmResult.set(isConfirmed ?? false));
    }

    /**
     * Opens the error dialog directly, without a failed request.
     */
    protected openErrorDialog(): void {
        this.errorNotification.showErrorDialog('Error dialog', 'This is what an error looks like.');
    }

    /**
     * Calls the sample API so the interceptor chain runs in the browser.
     * With the placeholder `baseUrl` this fails, which is the point: the error dialog should appear once.
     */
    protected callApi(): void {
        this.apiStatus.set('Calling…');
        this.api.getItems().subscribe({
            next: () => this.apiStatus.set('Succeeded'),
            error: (error: { status?: number }) => this.apiStatus.set(`Failed with status ${error.status ?? 'unknown'}`)
        });
    }
}
