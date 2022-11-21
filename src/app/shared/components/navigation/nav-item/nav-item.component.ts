import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NavItem } from 'src/app/shared/models/navItem.model';

@Component({
  selector: 'CHANGEME-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavItemComponent {
  @Input() item: NavItem;
  @Input() type: string;
}
