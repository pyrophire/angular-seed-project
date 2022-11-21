import { Injectable } from '@angular/core';
import { TLCJwtToken } from '@models/jwt-token.model';
import { SessionStorageService } from '@services/session-storage.service';
import { isAfter } from 'date-fns';

const TOKEN_KEY = 'CHANGEME_access_token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  protected sessionStorageService: SessionStorageService;

  constructor(sessionStorage: SessionStorageService) {
    this.sessionStorageService = sessionStorage;
  }

  signOut(): void {
    this.sessionStorageService.clear();
  }

  public saveToken(token: string, expires: string): void {
    this.sessionStorageService.removeItem(TOKEN_KEY);

    const tokenStorageItem = {
      token,
      expires
    };

    this.sessionStorageService.setItem(TOKEN_KEY, JSON.stringify(tokenStorageItem));

    console.log('Session Token Stored', this.sessionStorageService.getItem(TOKEN_KEY));
  }

  public hasToken(): boolean {
    const token = this.getToken();

    return token !== null && token !== undefined;
  }

  public getToken(): TLCJwtToken {
    const serializedToken = this.sessionStorageService.getItem(TOKEN_KEY);

    if (serializedToken !== null && serializedToken !== undefined) {
      const token = JSON.parse(serializedToken);

      const _isAfter = isAfter(new Date(token.expires), new Date());

      if (_isAfter) {
        this.sessionStorageService.removeItem(TOKEN_KEY);

        console.log('Session Token Expired', token);

        return null;
      }

      return token.token;
    }

    return null;
  }
}
