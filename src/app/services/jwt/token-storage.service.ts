import { Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { TLCJwtToken } from '@models/jwt-token.model';
import { isAfter } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import { Subject } from 'rxjs';
import { SessionStorageService } from '../util/session-storage.service';
import { JwtService } from './jwt.service';

const TOKEN_KEY = environment.storageKey;

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    public role = new Subject<string>();
    public permissions = new Subject<any[]>();
    // Store token in session storage consistently

    public userId = signal<string>(null);
    public officeId = signal<string>(null);

    constructor(
        private storage: SessionStorageService,
        private jwt: JwtService
    ) {}

    public saveToken(token: string, expires: string): void {
        this.storage.removeItem(TOKEN_KEY);

        const tokenStorageItem = {
            token,
            expires
        };

        this.storage.setItem(TOKEN_KEY, JSON.stringify(tokenStorageItem));

        this.getToken();
    }

    public hasToken(): boolean {
        const token = this.getToken();

        return token !== null && token !== undefined;
    }

    public getToken(): string {
        const serializedToken = this.storage.getItem(TOKEN_KEY);

        if (serializedToken !== null && serializedToken !== undefined) {
            const token = JSON.parse(serializedToken);

            const jwtToken: TLCJwtToken = jwtDecode(token.token);

            const utcSeconds = token.expires;
            const expiryDate = new Date(0);
            expiryDate.setUTCSeconds(utcSeconds);

            const _isStillValid = isAfter(new Date(expiryDate), new Date());

            // console.group('Token Storage');
            // console.log(expiryDate);
            // console.log(new Date(expiryDate));
            // console.log(new Date());
            // console.log(_isStillValid);
            // console.groupEnd();

            if (!_isStillValid) {
                this.storage.removeItem(TOKEN_KEY);

                return null;
            }

            return token.token;
        }

        return null;
    }
}
