import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../model/class/user';

@Injectable({
  providedIn: 'root',
})
export class AccountsadminService {
  private apiUrl = 'http://localhost:8069/api'; // 👉 Modifie l’URL selon ton backend

  constructor(private http: HttpClient) {}

  getAllAccounts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAllUsers`, {
      withCredentials: true,
    });
  }

  updateStatus(user_id: string, action: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/AdminActions`,
      { user_id, action },
      { withCredentials: true }
    );
  }
}
