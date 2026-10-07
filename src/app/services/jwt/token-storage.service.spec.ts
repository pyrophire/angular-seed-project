import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
    let service: TokenStorageService;
    const nowInSeconds = (): number => Math.floor(Date.now() / 1000);

    beforeEach(() => {
        sessionStorage.clear();
        vi.spyOn(console, 'warn').mockImplementation(() => undefined);
        service = TestBed.inject(TokenStorageService);
    });

    afterEach(() => vi.restoreAllMocks());

    it('has no token before one is saved', () => {
        expect(service.getToken()).toBeNull();
        expect(service.hasToken()).toBe(false);
    });

    it('returns a saved token that has not expired', () => {
        service.saveToken('abc', nowInSeconds() + 60);
        expect(service.getToken()).toBe('abc');
        expect(service.hasToken()).toBe(true);
    });

    it('accepts the expiry as a string, as decoded from older tokens', () => {
        service.saveToken('abc', String(nowInSeconds() + 60));
        expect(service.getToken()).toBe('abc');
    });

    it('removes and withholds an expired token', () => {
        service.saveToken('abc', nowInSeconds() - 1);
        expect(service.getToken()).toBeNull();
        expect(sessionStorage.getItem(environment.storageKey)).toBeNull();
    });

    it('clears the token on request', () => {
        service.saveToken('abc', nowInSeconds() + 60);
        service.clearToken();
        expect(service.hasToken()).toBe(false);
    });

    it.each([
        ['invalid JSON', '{not json'],
        ['an entry without a token', JSON.stringify({ expires: 1 })],
        ['a JSON null', 'null']
    ])('removes %s instead of throwing', (_case, stored) => {
        sessionStorage.setItem(environment.storageKey, stored);
        expect(service.getToken()).toBeNull();
        expect(sessionStorage.getItem(environment.storageKey)).toBeNull();
    });
});
