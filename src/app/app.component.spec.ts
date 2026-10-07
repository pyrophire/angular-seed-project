import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

describe('AppComponent', () => {
    it('boots with the real application providers and renders the shell', async () => {
        TestBed.configureTestingModule({ imports: [AppComponent], providers: [appConfig.providers, provideHttpClientTesting()] });
        const fixture = TestBed.createComponent(AppComponent);
        await fixture.whenStable();

        const element: HTMLElement = fixture.nativeElement;
        expect(element.querySelector('CHANGEME-navigation')).not.toBeNull();
        expect(element.querySelector('router-outlet')).not.toBeNull();
    });
});
