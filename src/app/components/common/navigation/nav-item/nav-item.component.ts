import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '@models/navItem.model';

@Component({
    selector: 'CHANGEME-nav-item',
    templateUrl: './nav-item.component.html',
    styleUrl: './nav-item.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive, MatButtonModule, MatMenuModule]
})
export class NavItemComponent {
    readonly item = input.required<NavItem>();
    /** How the item is rendered: inside a menu, or as a top-level button. */
    readonly type = input.required<'menuItem' | 'button'>();
}
