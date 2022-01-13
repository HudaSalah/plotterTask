import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  // Request options
  private getHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    return new HttpHeaders(headersConfig);
  }

  get(path: string, params?: HttpParams) : Observable<object> {
    return this.http.get(`${path}`);
  }

  post(path: string, body: object = {}) : Observable<object> {
    return this.http.post(`${path}`, body, { headers: this.getHeaders() });
  }
}
