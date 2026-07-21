import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../environments/environment';
import { Login } from '../models/login';
import { Register } from '../models/register';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = environment.apiUrl;

  // Signal tracking logged-in state reactively
  isLoggedInSignal = signal<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  register(data: Register): Observable<any> {
    return this.http.post(`${this.api}/auth/register`, data);
  }

  login(data: Login): Observable<any> {
    return this.http.post(`${this.api}/auth/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedInSignal.set(true); // Update reactive state
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSignal.set(false); // Update reactive state
    this.router.navigate(['/login']); // Redirect to login page
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}