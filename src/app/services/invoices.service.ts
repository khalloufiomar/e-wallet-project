import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  private apiUrl = 'http://localhost:8069/api';

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
  getInvoicePdf(id: string, access_token: string): Observable<Blob> {
  return this.http.get(`http://localhost:8069/my/invoices/${id}?access_token=${access_token}&report_type=pdf&download=true`, {
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Accept': 'application/pdf',
    },
    withCredentials: true,
    responseType: 'blob',
  });
}
}
