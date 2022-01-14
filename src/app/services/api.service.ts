import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient , private router: Router) {}
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

  redirectToNotFound() {
    this.router.navigate(['/404']);
  }
}
