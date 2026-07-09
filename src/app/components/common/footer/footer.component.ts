import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'CHANGEME-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogModule]
})
export class FooterComponent implements OnInit {
    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {}
}
