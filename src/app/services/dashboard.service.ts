import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user`);
  }

  getRecentTransactionsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:3000/transactions?userId=1&_sort=date&_order=desc&_limit=3`
    );
  }
  convertTndToCt(amount: number): Observable<number> {
    return new Observable<number>((observer) => {
      const rate = 5; // Exemple : 1 TND = 5 CT
      observer.next(amount * rate);
      observer.complete();
    });
  }
}
