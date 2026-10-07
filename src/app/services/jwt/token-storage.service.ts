import { Injectable, inject, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { isAfter } from 'date-fns';
import { SessionStorageService } from '../util/session-storage.service';

const TOKEN_KEY = environment.storageKey;

/** Shape of the entry kept in session storage. */
interface StoredToken {
    token: string;
    /** Expiry as seconds since the Unix epoch (the JWT `exp` claim). */
    expires: string | number;
}

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    private readonly storage = inject(SessionStorageService);

    public readonly role = signal<string | null>(null);
    public readonly permissions = signal<string[]>([]);
    public readonly userId = signal<string | null>(null);
    public readonly officeId = signal<string | null>(null);

    /**
     * Stores the token, replacing any previous one.
     *
     * @param token - The encoded JWT
     * @param expires - Expiry as seconds since the Unix epoch (the JWT `exp` claim)
     */
    public saveToken(token: string, expires: string | number): void {
        const storedToken: StoredToken = { token, expires };
        this.storage.setItem(TOKEN_KEY, JSON.stringify(storedToken));
    }

    /**
     * Removes the stored token so the next request authenticates again.
     */
    public clearToken(): void {
        this.storage.removeItem(TOKEN_KEY);
    }

    /**
     * @returns True when an unexpired token is stored
     */
    public hasToken(): boolean {
        return this.getToken() !== null;
    }

    /**
     * Reads the stored token. An expired or unreadable entry is removed.
     *
     * @returns The encoded JWT, or null when none is stored or it has expired
     */
    public getToken(): string | null {
        const storedToken = this.readStoredToken();
        if (storedToken === null) {
            return null;
        }

        const expiryDate = new Date(Number(storedToken.expires) * 1000);
        if (!isAfter(expiryDate, new Date())) {
            this.clearToken();
            return null;
        }

        return storedToken.token;
    }

    /**
     * @returns The parsed storage entry, or null when it is missing or malformed
     */
    private readStoredToken(): StoredToken | null {
        const serializedToken = this.storage.getItem(TOKEN_KEY);
        if (!serializedToken) {
            return null;
        }
        try {
            const storedToken = JSON.parse(serializedToken) as Partial<StoredToken>;
            if (typeof storedToken?.token === 'string' && storedToken.expires !== undefined) {
                return storedToken as StoredToken;
            }
        } catch {
            // Fall through: a corrupt entry is treated the same as an invalid one.
        }
        console.warn('Stored token entry was malformed and has been removed.');
        this.clearToken();
        return null;
    }
}
