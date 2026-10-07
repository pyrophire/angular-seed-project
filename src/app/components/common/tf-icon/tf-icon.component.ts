import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'ix-tf-icon',
    templateUrl: './tf-icon.component.html',
    styleUrl: './tf-icon.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIconModule]
})
export class TfIconComponent {
    /** The value to display: a check for true, a cross for false. */
    readonly data = input.required<boolean>();
}
