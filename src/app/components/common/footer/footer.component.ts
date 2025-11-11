import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'CHANGEME-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatDialogModule]
})
export class FooterComponent implements OnInit {
    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {}
}
