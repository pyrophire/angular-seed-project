import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '@models/navItem.model';

@Component({
    selector: 'CHANGEME-nav-item',
    templateUrl: './nav-item.component.html',
    styleUrls: ['./nav-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, RouterLinkActive, MatButtonModule, MatMenuModule]
})
export class NavItemComponent {
    @Input() item: NavItem;
    @Input() type: string;
}
