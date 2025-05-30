import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../model/class/user';
@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = 'http://localhost:8069/api';

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/getAllCompanies`);
  }

  addCompany(name: string, email: string): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}/add_company`, {name,email});
  }
}
