/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from './CustomHttp.interceptor';
import { ServerErrorInterceptor } from './server-error-interceptor';

// Comment this in if you will be using JWT
// import { JwtInterceptor } from './jwt.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CustomHttpInterceptor,
    multi: true,
  },
  { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },

  // Comment this in if you will be using JWT
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: JwtInterceptor,
  //   multi: true
  // }
];
