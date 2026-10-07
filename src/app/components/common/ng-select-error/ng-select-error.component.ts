import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ix-ng-select-error',
    templateUrl: './ng-select-error.component.html',
    styleUrl: './ng-select-error.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgSelectErrorComponent {}
