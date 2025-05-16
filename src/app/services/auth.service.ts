import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8069/';
  constructor(private http: HttpClient, private router: Router) {}

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUserInfos(): Observable<any> {
    return this.http.get(`${this.baseUrl}web/session/me`, { withCredentials: true });
  }
  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }


  logoutCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}web/session/logout`, { withCredentials: true });
  }

  updateUserInfo(name: string, email: string, phone: string): Observable<any> {
    const payload = {
      name,
      email,
      phone
    };
    console.log('Payload for update:', payload);
    return this.http.post(`${this.baseUrl}api/changeUserInfos`, payload);
  }
}
