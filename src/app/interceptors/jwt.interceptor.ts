import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenResolver } from '../services/jwt/token.resolver';

const TOKEN_HEADER_KEY = 'Authorization';

/**
 * @param url - A request or response URL
 * @returns True when the URL targets the token endpoint, which must never carry or trigger a token
 */
function isAuthenticateCall(url: string | null): boolean {
    return !!url && url.includes('/authenticate');
}

/**
 * @param error - The error raised by the downstream handler
 * @returns True when the API itself (not the token endpoint) rejected the request as unauthorized
 */
function isRejectedToken(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 401 && !isAuthenticateCall(error.url);
}

/**
 * Attaches a bearer token to every API request.
 *
 * The token comes from storage, or from a single shared authenticate call when none is stored.
 * If the API answers 401, the stored token is discarded, a new one is requested, and the request
 * is replayed exactly once. A second failure is passed on to the caller.
 *
 * @param req - The outgoing request
 * @param next - The next handler in the interceptor chain
 * @returns The response event stream
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    if (!req.url.includes('/api') || isAuthenticateCall(req.url)) {
        return next(req);
    }

    const tokenResolver = inject(TokenResolver);
    const sendWithToken = (token: string) => next(req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, `Bearer ${token}`) }));

    return tokenResolver.resolve().pipe(
        switchMap(sendWithToken),
        catchError((error: unknown) => {
            if (!isRejectedToken(error)) {
                return throwError(() => error);
            }
            tokenResolver.invalidate();
            return tokenResolver.resolve().pipe(switchMap(sendWithToken));
        })
    );
};
