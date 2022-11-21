import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { JwtService } from './jwt.service';
import { TokenStorageService } from './token-storage.service';
import { TLCJwtToken } from '@models/jwt-token.model';

@Injectable()
export class TokenResolver implements Resolve<TLCJwtToken> {
  constructor(private jwtService: JwtService, private tokenStorageService: TokenStorageService) {}

  resolve(): Observable<TLCJwtToken> {
    // console.log('Token resolver');

    const token = this.tokenStorageService.getToken();

    if (token !== null && token !== undefined) {
      // console.log('Token resolved from current');
      return of(token);
    }

    return this._resolveToken();
  }

  private _resolveToken(): Observable<TLCJwtToken> {
    return this.jwtService.authenticateJwt().pipe(
      switchMap((authResponse) => {
        this.tokenStorageService.saveToken(authResponse.body.bearerToken, authResponse.body.expires);

        // console.log('Token resolved from auth call');

        return of(authResponse.body.bearerToken);
      })
    );
  }
}
