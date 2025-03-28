import { HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.

    const headers = new HttpHeaders({});
    let headReq: HttpRequest<any> = req.clone({});

    if (!req.headers.has('Content-Type') && req.url.includes('/api/')) {
      if (headReq) {
        headReq = headReq.clone({
          headers: req.headers.set('Content-Type', 'application/json'),
          withCredentials: environment.useWinAuth
        });
      } else {
        headReq = req.clone({
          headers: req.headers.set('Content-Type', 'application/json'),
          withCredentials: environment.useWinAuth
        });
      }
    }

    if (req.url.includes('authenticate/windows')) {
      if (headReq) {
        headReq = headReq.clone({
          withCredentials: environment.useWinAuth
        });
      } else {
        headReq = req.clone({
          withCredentials: environment.useWinAuth
        });
      }
    }

    if (req.url.includes('rpns20')) {
      if (headReq) {
        headReq = headReq.clone({
          withCredentials: false,
          headers: req.headers.set('Content-Type', 'text/plain')
        });
      } else {
        headReq = req.clone({
          withCredentials: false,
          headers: req.headers.set('Content-Type', 'text/plain')
        });
      }
    }

    // send cloned request with header to the next handler.
    if (headReq) {
      return next.handle(headReq);
    } else {
      return next.handle(req);
    }
  }
}
