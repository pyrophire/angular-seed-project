import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParamBuilderService {
  constructor() {}

  // tslint:disable-next-line: ban-types
  buildParams(params: Object): string {
    let paramString = Object.keys(params)
      .map((key) => {
        if (params[key] != null && params[key].trim().length > 0) {
          return `${key}=${params[key]}`;
        } else {
          return;
        }
      })
      .join('&');

    while (paramString.charAt(0) === '&') {
      paramString = paramString.substr(1);
    }
    return paramString;
  }
}
