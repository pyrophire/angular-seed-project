import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { IxScrollModule, IxScrollProgressModule, ProgressBarConfig } from '@pyrophire/ix-libs';
import { environment } from 'src/environments/environment';
import { FooterComponent } from './components/common/footer/footer.component';
import { NavigationComponent } from './components/common/navigation/navigation.component';

@Component({
    selector: 'CHANGEME-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [CommonModule, RouterOutlet, NavigationComponent, FooterComponent, IxScrollModule, IxScrollProgressModule]
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

    constructor(iconRegistry: MatIconRegistry) {
        iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    }

    ngOnInit(): void {}
}
