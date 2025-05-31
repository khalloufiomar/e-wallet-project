import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/class/user';
import { ProductPayload } from '../model/class/user';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3050/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductPayload[]> {
    return this.http.get<ProductPayload[]>(`${this.apiUrl}`);
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private backendUrl = 'http://localhost:3000/products'; // à modifier

  addProduct(product: ProductPayload): Observable<ProductPayload> {
    return this.http.post<ProductPayload>(this.apiUrl, product);
  }
  updateProduct(id: number, productPayload: ProductPayload): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, productPayload);
  }
}
