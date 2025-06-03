import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/class/user';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private apiUrl = 'http://localhost:8069/api/sign_up_user';

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer la liste des utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl); // Envoie une requête GET pour obtenir les utilisateurs
  }

  // Méthode pour créer un utilisateur
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user); // Envoie une requête POST pour ajouter un utilisateur
  }
}
