import { Injectable, inject } from '@angular/core';
import { TLCJwtToken } from '@models/jwt-token.model';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { finalize, map, shareReplay } from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class TokenResolver {
    private readonly jwtService = inject(JwtService);
    private readonly tokenStorageService = inject(TokenStorageService);

    /** The authenticate call currently in flight, shared by every request waiting on a token. */
    private pendingToken$: Observable<string> | null = null;

    /**
     * Provides a valid token, from storage when possible.
     * When none is stored, one authenticate call is made and shared by all concurrent callers.
     *
     * @returns An observable that emits the encoded JWT once
     */
    resolve(): Observable<string> {
        const token = this.tokenStorageService.getToken();
        if (token !== null) {
            return of(token);
        }

        this.pendingToken$ ??= this.requestToken();
        return this.pendingToken$;
    }

    /**
     * Discards the stored token. Call when the API rejects it.
     */
    invalidate(): void {
        this.tokenStorageService.clearToken();
    }

    /**
     * Authenticates against the API and stores the returned token.
     *
     * @returns A shared observable that emits the new token once
     */
    private requestToken(): Observable<string> {
        return this.jwtService.authenticateJwt().pipe(
            map((response) => {
                const token = response.body?.token;
                if (!token) {
                    throw new Error('Authenticate response did not contain a token');
                }
                const parsedToken = jwtDecode<TLCJwtToken>(token);
                this.tokenStorageService.saveToken(token, parsedToken.exp);
                return token;
            }),
            finalize(() => (this.pendingToken$ = null)),
            shareReplay({ bufferSize: 1, refCount: false })
        );
    }
}
