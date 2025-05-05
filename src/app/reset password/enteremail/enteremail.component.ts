import { CommonModule, Location, NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { UpdatepasswordService } from '../../services/updatepassword.service';
@Component({
  selector: 'app-enteremail',
  imports: [FormsModule, NgClass, CommonModule, FormsModule, RouterLink],
  templateUrl: './enteremail.component.html',
  styleUrl: './enteremail.component.css',
})
export class EnteremailComponent {
  email: string = ''; // Email entré par l'utilisateur
  alertMessage: string = ''; // Contenu du message d'alerte
  alertType: 'success' | 'error' | null = null; // Type d'alerte à afficher
  alertColor: string = '#FFFFFF'; // Couleur de fond de l'alerte
  showForm: boolean = true; // Contrôle l'affichage du formulaire
  showAlert: boolean = false; // Contrôle l'affichage de l'alerte
  isLoading: boolean = false; // Indique si une requête est en cours

  constructor(private http: HttpClient, private location: Location, private UpdatepasswordService: UpdatepasswordService) {}

  onSubmit() {
    // ➤ Réinitialisation des anciennes alertes
    this.alertMessage = '';
    this.alertType = null;
    this.alertColor = '#FFFFFF';
    this.showAlert = false;

    // ➤ Vérification email vide ou invalide
    if (!this.email || !this.validateEmail(this.email)) {
      this.alertMessage =
        '<strong>Invalid email</strong><br>Please enter a valid email address.';
      this.alertType = 'error';
      this.alertColor = '#FFDADA';
      this.showAlert = true;
      return;
    }

    this.isLoading = true;

    this.UpdatepasswordService.sendPasswordResetRequest(this.email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showAlert = true;
    
        if (response.success) {
          this.alertMessage =
            "<strong>Check your email.</strong><br>We've sent a password reset link to your email address.";
          this.alertType = 'success';
          this.alertColor = '#04A421';
          this.showForm = false;
        } else {
          this.alertMessage =
            '<strong>Error</strong><br>This email address is not registered in our system. Please check your email or sign up for a new account.';
          this.alertType = 'error';
          this.alertColor = '#FFDADA';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showAlert = true;
        this.alertMessage =
          '<strong>Error</strong><br>Unable to process your request. Please try again later.';
        this.alertType = 'error';
        this.alertColor = '#FFDADA';
        console.error('Erreur:', error);
      },
    });
    
  }

  // ➤ Validation d'email simple (à ajouter dans la même classe)
  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  goBack(): void {
    this.location.back();
  }
}
