import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  private apiUrl = 'http://localhost:8069/api'; // Remplace par ton vrai endpoint si différent

  constructor(private http: HttpClient) {}

  getAllInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getInvoices`, {
      withCredentials: true,
    });
  }
  // Récupérer les détails d'une facture par son ID
  getInvoiceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getInvoiceById?id=${id}`, {
      withCredentials: true,
    });
  }
}
