import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '@environments/environment';
import { ProgressBarConfig, ScrollBarProgressComponent, ScrollTopButtonComponent } from '@pyrophire/ix-libs';
import { FooterComponent } from './components/common/footer/footer.component';
import { NavigationComponent } from './components/common/navigation/navigation.component';

@Component({
    selector: 'CHANGEME-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [RouterOutlet, NavigationComponent, FooterComponent, ScrollTopButtonComponent, ScrollBarProgressComponent]
})
export class AppComponent {
    protected readonly use = environment;
    protected readonly scrollProgressConfig: ProgressBarConfig = {
        backgroundColor: 'transparent',
        barColor: 'red',
        position: 'fixed',
        bottom: 0,
        left: 0
    };
}
