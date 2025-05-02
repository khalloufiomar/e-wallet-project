import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private apiUrl = 'http://localhost:3000/products'; // URL du JSON Server

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les données
  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
