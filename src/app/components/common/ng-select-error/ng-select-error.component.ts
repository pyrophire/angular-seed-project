import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ix-ng-select-error',
    templateUrl: './ng-select-error.component.html',
    styleUrls: ['./ng-select-error.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [CommonModule]
})
export class NgSelectErrorComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
