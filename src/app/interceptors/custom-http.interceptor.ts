import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '@environments/environment';

/**
 * Tells whether the request body already dictates its own content type.
 * The browser must set the header for these (multipart boundaries, blob types), so it must not be overridden.
 *
 * @param body - The outgoing request body
 * @returns True when the content type must be left for the browser to set
 */
function hasSelfDescribingBody(body: unknown): boolean {
    return body instanceof FormData || body instanceof Blob || body instanceof ArrayBuffer || body instanceof URLSearchParams;
}

/**
 * Tells whether the request should default to a JSON content type.
 *
 * @param req - The outgoing request
 * @returns True for API calls that have no content type and whose body does not define one
 */
function needsJsonContentType(req: HttpRequest<unknown>): boolean {
    return req.url.includes('/api/') && !req.headers.has('Content-Type') && !hasSelfDescribingBody(req.body);
}

/**
 * Applies the app-wide request defaults:
 * - RPNS calls are sent as `text/plain` without credentials (RPNS does not accept `application/json`).
 * - API calls default to `application/json` and carry credentials when Windows auth is enabled.
 * - The Windows authenticate endpoint carries credentials when Windows auth is enabled.
 *
 * @param req - The outgoing request
 * @param next - The next handler in the interceptor chain
 * @returns The response event stream
 */
export const customHttpInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.includes('rpns20')) {
        return next(req.clone({ withCredentials: false, headers: req.headers.set('Content-Type', 'text/plain') }));
    }

    const isApiCall = req.url.includes('/api/');
    const isWindowsAuthCall = req.url.includes('authenticate/windows');
    if (!isApiCall && !isWindowsAuthCall) {
        return next(req);
    }

    return next(
        req.clone({
            withCredentials: environment.useWinAuth,
            headers: needsJsonContentType(req) ? req.headers.set('Content-Type', 'application/json') : req.headers
        })
    );
};
