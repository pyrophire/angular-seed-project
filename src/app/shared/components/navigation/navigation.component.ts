import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavItem } from '@models/navItem.model';
import { IxDarkService } from 'ix-libs';

@Component({
    selector: 'CHANGEME-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
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

  constructor(private darkService: IxDarkService) {}

  public toggleDarkMode(): void {
    this.darkService.toggleDarkLightMode();
  }

  private _subToTheme() {
    this.darkService.themeStream.subscribe((ev) => {
      // console.log(ev);
      this.theme = ev;
    });
  }

  ngOnInit(): void {
    this._subToTheme();
    this.darkService.setDarkModePreference();
  }
}
