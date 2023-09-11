import { Params } from '@angular/router';

export class NavItem {
  name: string;

  type?: 'route' | 'link'; // 'route' or 'link' or null for container of children

  route?: string; // Used to navigate within the app
  queryParams?: Params; // Used to pass thru params to the routerLink directive

  url?: string; // Used to navigate the user outside of the app
  target?: string; // Used to navigate the user outside of the app to a new or specific window

  children?: NavItem[]; // used to nest navigation
  queryParamsHandling?: QueryParamsHandling;

  constructor(
    name: string,
    type?: 'route' | 'link',
    route?: string,
    queryParams?: Params,
    url?: string,
    target?: string,
    children?: NavItem[]
  ) {
    this.name = name;
    this.type = type;
    this.route = route;
    this.queryParams = queryParams;
    this.url = url;
    this.target = target;
    this.children = children;
  }
}
