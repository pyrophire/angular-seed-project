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
      if (params[key] != undefined && params[key] != null && params[key].trim().length > 0) {
        return `${key}=${params[key]}`;
      } else {
        return null;
      }
    })
    .filter(param => param !== null)
    .join('&');

  return paramString;
}
