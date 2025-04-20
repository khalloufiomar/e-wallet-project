import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8069/api/web/session/authenticate';

  constructor(private http: HttpClient) {}
  
  // Méthode pour envoyer l'email et le mot de passe au backend
  login(login: string, password: string): Observable<any> {
    const userData = { login, password }; // Données à envoyer
    return this.http.post(this.apiUrl, userData,{
      withCredentials: true, 
      }); // Envoi des données avec POST
  }
}

