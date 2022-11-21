import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavItem } from '@models/navItem.model';
import { IxDarkService, IxMediaQueryService } from 'ix-libs';

@Component({
  selector: 'CHANGEME-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit {
  @Input() sticky: boolean;
  theme: string;
  navItems: NavItem[] = [
    {
      name: 'Home',
      type: 'route',
      route: '/home',
      children: null
    },

    {
      name: 'Layer 1',
      route: '/home',
      children: [
        {
          name: 'Layer 2',
          route: '/home',
          children: [
            {
              name: 'Layer 3',
              route: '/home',
              children: [
                {
                  name: 'Layer 4',
                  route: '/home'
                },
                {
                  name: 'Layer 4 No Child',
                  type: 'route',
                  route: '/home',
                  children: null
                },
                {
                  name: 'Google Out',
                  type: 'link',
                  url: 'https://google.com',
                  target: '_blank'
                },

                {
                  name: 'css-tricks alpha window',
                  type: 'link',
                  url: 'https://css-tricks.com',
                  target: 'alpha'
                },

                {
                  name: 'github alpha',
                  type: 'link',
                  url: 'https://github.com',
                  target: 'alpha'
                }
              ]
            },
            {
              name: 'Layer 3 No Child',
              type: 'route',
              route: '/home',
              children: null
            }
          ]
        },
        {
          name: 'Layer 2 No Child',
          type: 'route',
          route: '/home',
          children: null
        }
      ]
    }
  ];

  constructor(public mq: IxMediaQueryService, private darkService: IxDarkService) {}

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
