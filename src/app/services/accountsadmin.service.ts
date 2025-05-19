import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../model/class/user';

@Injectable({
  providedIn: 'root',
})
export class AccountsadminService {
  private apiUrl = 'http://localhost:8080/api/accounts'; // 👉 Modifie l’URL selon ton backend

  constructor(private http: HttpClient) {}

  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  private baseUrl = 'http://localhost:3001/accounts'; // Remplacez par votre URL

  updateStatus(accountId: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${accountId}`, { status });
  }

  deleteAccount(accountId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${accountId}`);
  }
}
