import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavItem } from '@models/navItem.model';
import { NavItemComponent } from './nav-item.component';

describe('NavItemComponent', () => {
    /** Renders the component and returns its anchor element. */
    const renderAnchor = async (item: NavItem): Promise<HTMLAnchorElement> => {
        TestBed.configureTestingModule({ imports: [NavItemComponent], providers: [provideRouter([])] });
        const fixture = TestBed.createComponent(NavItemComponent);
        fixture.componentRef.setInput('item', item);
        fixture.componentRef.setInput('type', 'button');
        await fixture.whenStable();
        return fixture.nativeElement.querySelector('a');
    };

    it('renders a route item as a router link', async () => {
        const anchor = await renderAnchor({ name: 'Home', type: 'route', route: '/home' });
        expect(anchor.textContent.trim()).toBe('Home');
        expect(anchor.getAttribute('href')).toBe('/home');
    });

    it('renders a link item as an external link that opens in a new tab by default', async () => {
        const anchor = await renderAnchor({ name: 'Docs', type: 'link', url: 'https://angular.dev' });
        expect(anchor.getAttribute('href')).toBe('https://angular.dev');
        expect(anchor.target).toBe('_blank');
    });

    it('honours an explicit link target', async () => {
        const anchor = await renderAnchor({ name: 'Docs', type: 'link', url: 'https://angular.dev', target: '_self' });
        expect(anchor.target).toBe('_self');
    });
});
