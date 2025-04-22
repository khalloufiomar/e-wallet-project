import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../model/class/user';
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:8069/api/getTransactions'; // Remplace par l'URL de ton API

  constructor(private http: HttpClient) {}
  
  getSelfTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl,{
      withCredentials: true, 
      });
  }
}
