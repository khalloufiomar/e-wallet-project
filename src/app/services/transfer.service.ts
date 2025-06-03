import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  userId: number;
  userName: string;
  walletId: number;
  balance: number;
}

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private apiUrl = 'http://localhost:8069';

  constructor(private http: HttpClient) {}

  sendCoins(data: {
    recipientWalletId: string;
    amount: number;
    description?: string;
  }): Observable<any> {
    console.log(data);
    return this.http.post(`${this.apiUrl}/api/sendCredit`, data);
  }
  // Récupération des derniers transferts
  getLastTransfers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/getTransfers`);
  }

  getEmpsWallet(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/api/getEmpsWallet`, {
      withCredentials: true,
    });
  }
}
