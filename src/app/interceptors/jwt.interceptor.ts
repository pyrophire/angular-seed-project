import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TokenResolver } from '../services/jwt/token.resolver';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    dialogOpen: boolean = false;
    constructor(
        public dialog: MatDialog,
        private jwtResolver: TokenResolver
    ) {}
    intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!httpRequest.url.match('/authenticate') && httpRequest.url.match('/api')) {
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

    private _injectToken(token: string, httpRequest: HttpRequest<any>): Observable<HttpRequest<any>> {
        const authenticatedRequest = httpRequest.clone({ headers: httpRequest.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

        return of(authenticatedRequest);
    }
}
