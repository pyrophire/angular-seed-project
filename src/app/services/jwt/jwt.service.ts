import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { JwtAuthenticationResponse } from '@models/jwt-token.model';
import { Observable } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as const
};

@Injectable({
    providedIn: 'root'
})
export class JwtService {
    private readonly http = inject(HttpClient);

    /**
     * Requests a new token from the API using the app credentials in the environment file.
     *
     * @returns The full HTTP response; the token is in `body.token`
     */
    authenticateJwt(): Observable<HttpResponse<JwtAuthenticationResponse>> {
        return this.http.post<JwtAuthenticationResponse>(`${environment.baseUrl}/authenticate/credentials`, environment.tokenCreds, httpOptions);
    }
}
