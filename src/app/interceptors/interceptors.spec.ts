import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environments/environment';
import { appConfig } from '../app.config';
import { makeTestJwt } from '../testing/jwt-test-helpers';

const AUTH_URL = `${environment.baseUrl}/authenticate/credentials`;
const ITEMS_URL = `${environment.baseUrl}/items`;
const UNAUTHORIZED = { status: 401, statusText: 'Unauthorized' };
const UNAVAILABLE = { status: 503, statusText: 'Service Unavailable' };

describe('HTTP interceptors, wired through the real appConfig', () => {
    const dialog = { open: vi.fn() };
    let http: HttpClient;
    let httpTesting: HttpTestingController;

    /** Answers the pending authenticate call with a fresh token and returns that token. */
    const flushAuthentication = (tag = 'a'): string => {
        const token = makeTestJwt(3600, tag);
        httpTesting.expectOne(AUTH_URL).flush({ token });
        return token;
    };
    const dialogMessage = (): string => dialog.open.mock.calls[0][1].data.message;

    beforeEach(() => {
        sessionStorage.clear();
        dialog.open.mockClear();
        vi.useFakeTimers();
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
        TestBed.configureTestingModule({
            providers: [appConfig.providers, provideHttpClientTesting(), { provide: MatDialog, useValue: dialog }]
        });
        http = TestBed.inject(HttpClient);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    describe('jwtInterceptor', () => {
        it('authenticates once for concurrent requests and attaches the token to each', () => {
            http.get(ITEMS_URL).subscribe();
            http.get(`${ITEMS_URL}?page=2`).subscribe();
            http.get(`${ITEMS_URL}?page=3`).subscribe();

            const token = flushAuthentication();

            const requests = httpTesting.match((req) => req.url.startsWith(ITEMS_URL));
            expect(requests).toHaveLength(3);
            requests.forEach((req) => expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`));
            requests.forEach((req) => req.flush({}));
        });

        it('does not send a token to the authenticate endpoint', () => {
            http.get(ITEMS_URL).subscribe();
            const authentication = httpTesting.expectOne(AUTH_URL);
            expect(authentication.request.headers.has('Authorization')).toBe(false);
            authentication.flush({ token: makeTestJwt() });
            httpTesting.expectOne(ITEMS_URL).flush({});
        });

        it('reuses the stored token on later requests', () => {
            http.get(ITEMS_URL).subscribe();
            const token = flushAuthentication();
            httpTesting.expectOne(ITEMS_URL).flush({});

            http.get(ITEMS_URL).subscribe();

            httpTesting.expectNone(AUTH_URL);
            const second = httpTesting.expectOne(ITEMS_URL);
            expect(second.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
            second.flush({});
        });

        it('authenticates again once the stored token has expired', () => {
            http.get(ITEMS_URL).subscribe();
            flushAuthentication('first');
            httpTesting.expectOne(ITEMS_URL).flush({});

            vi.advanceTimersByTime(3601 * 1000);
            http.get(ITEMS_URL).subscribe();

            const token = flushAuthentication('second');
            const request = httpTesting.expectOne(ITEMS_URL);
            expect(request.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
            request.flush({});
        });

        it('leaves requests outside the API untouched', () => {
            http.get('/assets/markdown/manifest.json').subscribe();
            httpTesting.expectNone(AUTH_URL);
            const request = httpTesting.expectOne('/assets/markdown/manifest.json');
            expect(request.request.headers.has('Authorization')).toBe(false);
            request.flush({});
        });

        it('re-authenticates and replays the request once when the API answers 401', () => {
            let result: unknown;
            http.get(ITEMS_URL).subscribe((response) => (result = response));
            flushAuthentication('rejected');
            httpTesting.expectOne(ITEMS_URL).flush(null, UNAUTHORIZED);

            const freshToken = flushAuthentication('fresh');
            const replay = httpTesting.expectOne(ITEMS_URL);
            expect(replay.request.headers.get('Authorization')).toBe(`Bearer ${freshToken}`);
            replay.flush({ ok: true });

            expect(result).toEqual({ ok: true });
            expect(dialog.open).not.toHaveBeenCalled();
        });

        it('gives up after one replay and reports the error once', () => {
            let error: unknown;
            http.get(ITEMS_URL).subscribe({ error: (e: unknown) => (error = e) });
            flushAuthentication('rejected');
            httpTesting.expectOne(ITEMS_URL).flush(null, UNAUTHORIZED);
            flushAuthentication('also-rejected');
            httpTesting.expectOne(ITEMS_URL).flush(null, UNAUTHORIZED);

            vi.advanceTimersByTime(10_000);

            expect(error).toBeInstanceOf(HttpErrorResponse);
            expect(dialog.open).toHaveBeenCalledTimes(1);
        });

        it('makes one authenticate call and shows one dialog when the credentials are rejected', () => {
            let error: unknown;
            http.get(ITEMS_URL).subscribe({ error: (e: unknown) => (error = e) });
            httpTesting.expectOne(AUTH_URL).flush({ message: 'bad creds' }, UNAUTHORIZED);

            vi.advanceTimersByTime(10_000);

            expect(error).toBeInstanceOf(HttpErrorResponse);
            expect(dialog.open).toHaveBeenCalledTimes(1);
            expect(dialogMessage()).toBe('bad creds');
        });

        it('does not retry the outer request when the token endpoint is unavailable', () => {
            http.get(ITEMS_URL).subscribe({ error: () => undefined });
            httpTesting.expectOne(AUTH_URL).flush(null, UNAVAILABLE);

            vi.advanceTimersByTime(10_000);

            expect(dialog.open).toHaveBeenCalledTimes(1);
        });
    });

    describe('serverErrorInterceptor', () => {
        it('retries a GET once after a transient failure and stays silent when the retry succeeds', () => {
            let result: unknown;
            http.get(ITEMS_URL).subscribe((response) => (result = response));
            flushAuthentication();
            httpTesting.expectOne(ITEMS_URL).flush(null, UNAVAILABLE);

            vi.advanceTimersByTime(2000);
            httpTesting.expectOne(ITEMS_URL).flush({ ok: true });

            expect(result).toEqual({ ok: true });
            expect(dialog.open).not.toHaveBeenCalled();
        });

        it('never replays a failed POST', () => {
            http.post(ITEMS_URL, { name: 'x' }).subscribe({ error: () => undefined });
            flushAuthentication();
            httpTesting.expectOne(ITEMS_URL).flush(null, UNAVAILABLE);

            vi.advanceTimersByTime(10_000);

            expect(dialog.open).toHaveBeenCalledTimes(1);
            expect(dialogMessage()).toBe('Service unavailable. Please try again later.');
        });

        it('does not retry a client error', () => {
            http.get(ITEMS_URL).subscribe({ error: () => undefined });
            flushAuthentication();
            httpTesting.expectOne(ITEMS_URL).flush({ Message: 'No such item' }, { status: 404, statusText: 'Not Found' });

            vi.advanceTimersByTime(10_000);

            expect(dialogMessage()).toBe('No such item');
        });

        it('rethrows the original HttpErrorResponse and passes the support message to the dialog', () => {
            let error: unknown;
            http.post(ITEMS_URL, {}).subscribe({ error: (e: unknown) => (error = e) });
            flushAuthentication();
            httpTesting.expectOne(ITEMS_URL).flush(null, { status: 418, statusText: 'Teapot' });

            expect(error).toBeInstanceOf(HttpErrorResponse);
            expect((error as HttpErrorResponse).status).toBe(418);
            expect(dialog.open.mock.calls[0][1].data).toEqual({
                title: 'Error',
                message: 'Error 418: Teapot',
                supportMessage: environment.supportMessage,
                status: 418
            });
        });
    });

    describe('customHttpInterceptor', () => {
        it('defaults API requests to a JSON content type', () => {
            http.get(ITEMS_URL).subscribe();
            flushAuthentication();
            const request = httpTesting.expectOne(ITEMS_URL);
            expect(request.request.headers.get('Content-Type')).toBe('application/json');
            expect(request.request.withCredentials).toBe(environment.useWinAuth);
            request.flush({});
        });

        it('leaves the content type of a FormData upload for the browser to set', () => {
            const formData = new FormData();
            formData.append('file', new Blob(['x']), 'x.txt');
            http.post(ITEMS_URL, formData).subscribe();
            flushAuthentication();
            const request = httpTesting.expectOne(ITEMS_URL);
            expect(request.request.headers.has('Content-Type')).toBe(false);
            request.flush({});
        });

        it('keeps a content type the caller set explicitly', () => {
            http.post(ITEMS_URL, 'a,b', { headers: { 'Content-Type': 'text/csv' } }).subscribe();
            flushAuthentication();
            const request = httpTesting.expectOne(ITEMS_URL);
            expect(request.request.headers.get('Content-Type')).toBe('text/csv');
            request.flush({});
        });

        it('sends RPNS requests as text/plain without credentials', () => {
            const rpnsUrl = 'https://host/rpns20/negotiate';
            http.post(rpnsUrl, { a: 1 }).subscribe();
            const request = httpTesting.expectOne(rpnsUrl);
            expect(request.request.headers.get('Content-Type')).toBe('text/plain');
            expect(request.request.withCredentials).toBe(false);
            request.flush({});
        });
    });
});
