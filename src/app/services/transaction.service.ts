import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../model/class/user';
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:8069/api/getTransactions';

  constructor(private http: HttpClient) {}

  getSelfTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl, {
      withCredentials: true,
    });
  }
  getReport(type: string): Observable<any> {
    return this.http.get(
      `http://localhost:8069/transactions/export?type=${type}`,
      {
        withCredentials: true,
        responseType: 'blob', // <-- important if you're downloading a file!
      }
    );
  }
  private apitransactions = 'http://localhost:3006/transactions';

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apitransactions);
  }
}
