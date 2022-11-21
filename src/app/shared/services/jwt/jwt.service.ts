import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'response'
};

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(private http: HttpClient) {}

  authenticateJwt(): Observable<any> {
    return this.http.post(`${environment.baseUrl}/authentication/jwt`, environment.tokenCreds, httpOptions);
  }
}
