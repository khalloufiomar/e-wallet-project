import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class BuycoinsService {
  private apiUrl = 'http://localhost:8069/fund_wallet/request_invoice';

  constructor(private http: HttpClient) {}

  getInvoiceByQuantity(quantity: number): Observable<any> {
    console.log(quantity);
    const params = new HttpParams().set('quantity', quantity.toString());

    return this.http.get<any>(this.apiUrl, {
      params: params,
      withCredentials: true,
    });
  }
}
