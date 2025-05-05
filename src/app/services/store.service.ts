import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private baseApiUrl = 'http://localhost:8069/api'; // URL du JSON Server

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les données
  getData(): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/getCourses`,{ withCredentials: true });
  };
  purchaseCourse(courseId: string): Observable<any> {
    const params = new HttpParams().set('courseId', courseId);
    return this.http.get<any>(`${this.baseApiUrl}/purchaseCourse`, {
      params,
      withCredentials: true
    });
}}
