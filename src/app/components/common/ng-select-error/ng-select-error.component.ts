import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'ix-ng-select-error',
    templateUrl: './ng-select-error.component.html',
    styleUrls: ['./ng-select-error.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: []
})
export class NgSelectErrorComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
