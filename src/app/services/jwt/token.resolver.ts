import { Injectable } from '@angular/core';

import { TLCJwtToken } from '@models/jwt-token.model';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class TokenResolver {
    constructor(
        private jwtService: JwtService,
        private tokenStorageService: TokenStorageService
    ) {}

    resolve(): Observable<string> {
        const token = this.tokenStorageService.getToken();

        if (token !== null && token !== undefined) {
            return of(token);
        }

        return this._resolveToken();
    }

    private _resolveToken(): Observable<string> {
        return this.jwtService.authenticateJwt().pipe(
            switchMap((res) => {
                const parsedToken: TLCJwtToken = jwtDecode(res.body.token);

                this.tokenStorageService.saveToken(res.body.token, parsedToken.exp);

                return of(res.body.token);
            })
        );
    }
}
