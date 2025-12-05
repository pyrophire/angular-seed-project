import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideIxIcons, ScrollBarProgressComponent, ScrollTopButtonComponent } from '@pyrophire/ix-libs';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { FooterComponent } from './components/common/footer/footer.component';
import { NavigationComponent } from './components/common/navigation/navigation.component';
import { httpInterceptorProviders } from './interceptors';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        NavigationComponent,
        FooterComponent,
        ScrollTopButtonComponent,
        ScrollBarProgressComponent
    ],
    providers: [
        httpInterceptorProviders,
        provideHotToastConfig(),
        provideIxIcons(),
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                disableClose: true,
                hasBackdrop: true,
                maxHeight: '90dvh'
            }
        },
        {
            provide: OVERLAY_DEFAULT_CONFIG,
            useValue: {
                usePopover: false
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(iconRegistry: MatIconRegistry) {
        iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    }
}
