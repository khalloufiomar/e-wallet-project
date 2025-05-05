import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdatepasswordService {
  private baseApiUrl = 'http://localhost:8069/api'; // Remplacez par l'URL de votre API backend

  constructor(private http: HttpClient) {}

  // Méthode pour mettre à jour le mot de passe
  sendPasswordResetRequest(email: string): Observable<any> {
    // Envoi d'une requête POST avec le nouveau mot de passe
    return this.http.post(`${this.baseApiUrl}/request_passwordReset`, { email });
  }
  validateToken(token: string): Observable<any> {
    // Envoi d'une requête POST avec le nouveau mot de passe
    return this.http.post(`${this.baseApiUrl}/validateResetToken`, { token });
  }
  updatePassword(token: string, newPassword: string): Observable<any> {
    // Envoi d'une requête POST avec le nouveau mot de passe
    return this.http.post(`${this.baseApiUrl}/reset_password`, { token, newPassword });
  }
}
