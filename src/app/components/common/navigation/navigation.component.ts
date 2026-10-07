import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { NavItem } from '@models/navItem.model';
import { IxDarkService, ThemeButtonComponent } from '@pyrophire/ix-libs';
import { NavItemComponent } from './nav-item/nav-item.component';

@Component({
    selector: 'CHANGEME-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatMenuModule, MatButtonModule, MatIconModule, ThemeButtonComponent, NavItemComponent, RouterLink]
})
export class NavigationComponent implements OnInit {
    private readonly darkService = inject(IxDarkService);

    readonly sticky = input(false);
    /** Current theme name, tracked from ix-libs. */
    readonly theme = this.darkService.theme;

    navItems: NavItem[] = [
        {
            name: 'Home',
            type: 'route', // route or link
            route: '/home', // required when type is 'route'
            // queryParams: { }, // optional when type is 'route'
            // url: '' // required when type is 'link'
            // target: '' // optional when type is 'link', defaults to '_blank'
            children: null
        },

        {
            name: 'Angular',
            type: 'link',
            url: 'https://angular.dev/overview',
            children: null
        },
        {
            name: 'Angular Material',
            type: 'link',
            url: 'https://material.angular.dev/components/categories',
            children: null
        }
    ];

    ngOnInit(): void {
        this.darkService.setDarkModePreference();
    }

    /**
     * Switches between the light and dark themes.
     */
    public toggleDarkMode(): void {
        this.darkService.toggleDarkLightMode();
    }
}
