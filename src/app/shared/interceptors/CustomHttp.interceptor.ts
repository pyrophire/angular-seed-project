import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.

    const headers = new HttpHeaders({});
    let headReq: HttpRequest<any> = req.clone({});

    if (!req.headers.has('Content-Type')) {
      if (headReq) {
        headReq = headReq.clone({
          headers: req.headers.set('Content-Type', 'application/json'),
        });
      } else {
        headReq = req.clone({
          headers: req.headers.set('Content-Type', 'application/json'),
        });
      }
    }

    if (req.url.includes('authenticate/windows')) {
      if (headReq) {
        headReq = headReq.clone({
          withCredentials: true,
        });
      } else {
        headReq = req.clone({
          withCredentials: true,
        });
      }
    }

    if (req.url.includes('rpns20')) {
      if (headReq) {
        headReq = headReq.clone({
          withCredentials: false,
          headers: req.headers.set('Content-Type', 'text/plain'),
        });
      } else {
        headReq = req.clone({
          withCredentials: false,
          headers: req.headers.set('Content-Type', 'text/plain'),
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
