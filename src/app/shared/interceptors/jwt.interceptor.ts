import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { TokenResolver } from '../services/jwt/token.resolver';
import { TLCJwtToken } from '../models/jwt-token.model';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  dialogOpen: boolean;
  constructor(public dialog: MatDialog, private jwtResolver: TokenResolver) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!httpRequest.url.match('/authentication') && httpRequest.url.match('/api')) {
      return this._processToken(httpRequest).pipe(
        switchMap((authenticatedRequest) => {
          return next.handle(authenticatedRequest);
        })
      );
    } else {
      return next.handle(httpRequest);
    }
  }

  private _processToken(httpRequest: HttpRequest<any>): Observable<HttpRequest<any>> {
    return this.jwtResolver.resolve().pipe(
      switchMap((token) => {
        return this._injectToken(token, httpRequest);

        return of(httpRequest);
      })
    );
  }

  private _injectToken(token: TLCJwtToken, httpRequest: HttpRequest<any>): Observable<HttpRequest<any>> {
    const authenticatedRequest = httpRequest.clone({ headers: httpRequest.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

    return of(authenticatedRequest);
  }
}
