import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/class/user';
import { ProductPayload } from '../model/class/user';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3001/products'; // à adapter à ton backend

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private backendUrl = 'http://localhost:3000/products'; // à modifier

  addProduct(product: ProductPayload): Observable<any> {
    return this.http.post(this.backendUrl, product);
  }
}
