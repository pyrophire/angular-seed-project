import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'CHANGEME-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: []
})
export class HomeComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {
        // Initialization code
    }
}
