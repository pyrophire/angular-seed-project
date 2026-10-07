/* "Barrel" of Http Interceptors */
import { HttpInterceptorFn } from '@angular/common/http';
import { customHttpInterceptor } from './custom-http.interceptor';
import { jwtInterceptor } from './jwt.interceptor';
import { serverErrorInterceptor } from './server-error.interceptor';

export { customHttpInterceptor, jwtInterceptor, serverErrorInterceptor };

/**
 * Http interceptors in outside-in order: the first entry sees the request first and the response last.
 *
 * `serverErrorInterceptor` must stay outside `jwtInterceptor` so a request that the JWT interceptor
 * replays after re-authenticating is only reported to the user if the replay also fails.
 *
 * Remove `jwtInterceptor` from this array if the app does not use JWT.
 */
export const httpInterceptors: HttpInterceptorFn[] = [customHttpInterceptor, serverErrorInterceptor, jwtInterceptor];
