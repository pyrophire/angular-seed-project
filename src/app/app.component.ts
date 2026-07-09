import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ProgressBarConfig } from '@pyrophire/ix-libs';
import { environment } from '@environments/environment';

@Component({
    selector: 'CHANGEME-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    use = environment;
    scrollProgressConfig: ProgressBarConfig = {
        backgroundColor: 'transparent',
        barColor: 'red',
        position: 'fixed',
        bottom: 0,
        left: 0
    };

    constructor() {}

    ngOnInit(): void {}
}
