import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation, effect } from '@angular/core';
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
    styleUrls: ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule, ThemeButtonComponent, NavItemComponent, RouterLink]
})
export class NavigationComponent implements OnInit {
    @Input() sticky: boolean;
    theme: string;
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
            url: 'https://angular.io/docs',
            children: null
        },
        {
            name: 'Angular Material',
            type: 'link',
            url: 'https://material.angular.io/components/categories',
            children: null
        }
    ];

    constructor(private darkService: IxDarkService) {
        // Use signal-based theme tracking (ix-libs 21.1.0+)
        effect(() => {
            this.theme = this.darkService.theme();
        });
    }

    public toggleDarkMode(): void {
        this.darkService.toggleDarkLightMode();
    }

    ngOnInit(): void {
        this.darkService.setDarkModePreference();
    }
}
