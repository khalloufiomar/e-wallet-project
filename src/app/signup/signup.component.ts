import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SignupService } from '../services/signup.service';
import { Router } from '@angular/router';
import { User } from '../model/class/user';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-signup',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 'learner',
    companyCode: '',
    termsAccepted: false,
  };

  // Variables d'erreur
  nameError = false;
  emailError = false;
  passwordError = false;
  confirmPasswordError = false;
  companyCodeError = false;
  termsError = false;

  showPassword = false;
  showConfirmPassword = false;

  // Messages d'erreur
  nameErrorMessage = 'Name must contain only alphabetic characters.';
  emailErrorMessage = 'Please enter a valid email address.';
  passwordErrorMessage =
    'Password must be at least 8 characters, include uppercase, lowercase, and a number.';
  confirmPasswordErrorMessage = 'Passwords do not match.';
  companyCodeErrorMessage = 'Company Code is required for this user type.';
  termsErrorMessage = 'You must accept the terms and conditions.';

  // Messages d’erreur temporaires
  errorMessages: string[] = [];

  constructor(
    private signupService: SignupService,
    private router: Router,
    private location: Location
  ) {}

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Validation des champs
  validateName() {
    const namePattern = /^[A-Za-z\s]+$/;
    this.nameError = !namePattern.test(this.user.name.trim());
  }

  validateEmail() {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    this.emailError = !emailPattern.test(this.user.email.trim());
  }

  validatePassword() {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    this.passwordError = !passwordPattern.test(this.user.password);
  }

  validateConfirmPassword() {
    this.confirmPasswordError =
      this.user.password !== this.user.confirmPassword;
  }

  validateCompanyCode() {
    const type = this.user.type?.toLowerCase().trim();
    const requiresCompanyCode = ['hr', 'employee'].includes(type);

    if (requiresCompanyCode) {
      this.companyCodeError =
        !this.user.companyCode || !this.user.companyCode.trim();
    } else {
      this.companyCodeError = false; // Pas d'erreur pour les types qui ne le requièrent pas
    }
  }

  validateTerms() {
    this.termsError = !this.user.termsAccepted;
  }

  // Vérifie si le formulaire est invalide
  isFormInvalid(): boolean {
    this.validateName();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();
    this.validateCompanyCode();
    this.validateTerms();

    return (
      this.nameError ||
      this.emailError ||
      this.passwordError ||
      this.confirmPasswordError ||
      this.companyCodeError ||
      this.termsError
    );
  }

  showTemporaryErrors() {
    this.errorMessages = [];

    if (this.nameError) this.errorMessages.push(this.nameErrorMessage);
    if (this.emailError) this.errorMessages.push(this.emailErrorMessage);
    if (this.passwordError) this.errorMessages.push(this.passwordErrorMessage);
    if (this.confirmPasswordError)
      this.errorMessages.push(this.confirmPasswordErrorMessage);
    if (this.companyCodeError)
      this.errorMessages.push(this.companyCodeErrorMessage);
    if (this.termsError) this.errorMessages.push(this.termsErrorMessage);

    setTimeout(() => {
      this.errorMessages = [];
    }, 4000);
  }

  isSubmitting = false;
  showErrors = false;
  loginWithGoogle() {
    const clientId = environment.clientId;
    const redirectUri = encodeURIComponent(environment.redirectUri);
    const scope = encodeURIComponent('email profile openid');
    const responseType = 'code';

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=consent`;
    console.log('Clicked!');
    window.location.href = googleAuthUrl;
  }
  onSubmit() {
    this.isSubmitting = true;
    this.showErrors = true;

    if (this.isFormInvalid()) {
      console.log('Le formulaire contient des erreurs.');
      this.showTemporaryErrors();
      this.isSubmitting = false;
      return;
    }

    this.signupService
      .createUser(
        new User(
          this.user.name,
          this.user.email,
          this.user.type,
          this.user.companyCode,
          this.user.password
        )
      )
      .subscribe(
        (response) => {
          console.log('Utilisateur créé avec succès:', response);
          this.router.navigate(['/login']);
          this.isSubmitting = false;
        },
        (error) => {
          this.errorMessages.push(
            "Erreur lors de la création de l'utilisateur"
          );
          console.error("Erreur lors de la création de l'utilisateur:", error);
          this.isSubmitting = false;
          setTimeout(() => {
            this.errorMessages = [];
          }, 4000);
        }
      );
  }
  goBack(): void {
    this.location.back();
  }
}
