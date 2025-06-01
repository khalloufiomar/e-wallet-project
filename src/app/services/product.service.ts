import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/class/user';
import { ProductPayload } from '../model/class/user';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseApiUrl = 'http://localhost:8069/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductPayload[]> {
     return this.http.get<any>(`${this.baseApiUrl}/getCourses`,{ withCredentials: true })
  }

  activateDeactivateProduct(id: number): Observable<any> {
    const payload = {
      id: id
    };
    return this.http.post(`${this.baseApiUrl}/activateDeactivateProduct`, payload, { withCredentials: true });
  }

  addProduct(product: ProductPayload): Observable<ProductPayload> {
    return this.http.post<ProductPayload>(`${this.baseApiUrl}/addCourse`, product,{ withCredentials: true });
  }

  updateProduct(id: number, productPayload: ProductPayload): Observable<any> {
    const payload = {
      id: id,
      product: productPayload
    };
    return this.http.post(`${this.baseApiUrl}/updateProduct`, payload, { withCredentials: true });
  }
}
