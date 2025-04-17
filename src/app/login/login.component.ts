import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Response } from 'express';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
  };

  errorMessages: string[] = []; // Messages d'erreur
  showPassword: boolean = false;
  submitted: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {}

  // Valide le format de l'email
  isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  }

  // Méthode de connexion
  onLogin(): void {
    this.submitted = true;
    this.errorMessages = []; // Réinitialisation des erreurs

    // Validation manuelle
    if (!this.loginData.email) {
      this.errorMessages.push('Email is required.');
    } else if (!this.isValidEmail(this.loginData.email)) {
      this.errorMessages.push('Please enter a valid email address.');
    }

    if (!this.loginData.password) {
      this.errorMessages.push('Password is required.');
    }

    // Si erreurs de validation, afficher toast et masquer après 4s
    if (this.errorMessages.length > 0) {
      setTimeout(() => {
        this.errorMessages = [];
      }, 4000);
      return;
    }

    // Appel API
    this.loginService
      .login(this.loginData.email, this.loginData.password)
      .subscribe(
        (response) => {
          console.log('Connexion réussie:', response);
          this.router.navigate(['/user/dashboard']);
        },
        (error) => {
          console.error('Erreur lors de la connexion:', error);
          this.errorMessages.push(
            'Erreur de connexion, email ou mot de passe incorrect.'
          );

          // Masquer le toast après 4 secondes
          setTimeout(() => {
            this.errorMessages = [];
          }, 4000);
        }
      );
  }

  // Afficher/Masquer le mot de passe
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  goHome(): void {
    // Redirection vers la page d'accueil
    this.router.navigate(['/']);
  }
}
