import { CommonModule, Location, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UpdatepasswordService } from '../../services/updatepassword.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-updatepassword',
  imports: [NgClass, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './updatepassword.component.html',
  styleUrl: './updatepassword.component.css',
})
export class UpdatepasswordComponent implements OnInit {
  passwordForm: FormGroup;
  submitted = false;
  showNew = false;
  showConfirm = false;
  passwordCriteria = {
    minLength: false,
    upperCase: false,
    lowerCase: false,
    number: false,
  };
  successMessage = '';
  errorMessage = '';
  showRedirectButton = false;
  tokenValid = false;
  tokenInvalidMessage = '';
  private token = '';

  constructor(
    private fb: FormBuilder,
    private UpdatepasswordService: UpdatepasswordService,
    private location: Location,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.passwordForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/),
          Validators.pattern(/[a-z]/),
          Validators.pattern(/[0-9]/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    });

    this.passwordForm.get('newPassword')?.valueChanges.subscribe((value) => {
      this.passwordCriteria.minLength = value.length >= 8;
      this.passwordCriteria.upperCase = /[A-Z]/.test(value);
      this.passwordCriteria.lowerCase = /[a-z]/.test(value);
      this.passwordCriteria.number = /\d/.test(value);
    });
  }

  ngOnInit(): void {
    // Extract token from URL
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      if (this.token) {
        this.validateToken(this.token);
      } else {
        this.tokenInvalidMessage = 'Missing token in the URL.';
      }
    });
  }

  validateToken(token: string): void {
    this.UpdatepasswordService.validateToken(token).subscribe({
      next: (res) => {
        // Handle a valid token
        if (res.response) {
          this.tokenValid = true;
        } else {
          this.tokenInvalidMessage = 'This password reset link is invalid or has expired.';
        }
      },
      error: (err) => {
        this.tokenInvalidMessage = 'An error occurred while validating the token.';
        console.error(err);
      },
    });
  }

  onSubmit() {
    this.submitted = true;

    if (
      this.passwordForm.valid &&
      this.passwordForm.controls['newPassword'].value ===
        this.passwordForm.controls['confirmPassword'].value
    ) {
      const newPassword = this.passwordForm.controls['newPassword'].value;

      // Example: Call service to update the password with the token
      this.UpdatepasswordService.updatePassword(this.token, newPassword).subscribe({
        next: (res) => {
          if (res.response === true) {
            console.log(res);
            this.tokenValid = true;
            this.successMessage = 'Password updated successfully.';
            this.errorMessage = '';
            this.showRedirectButton = true;
          } else {
            console.log(res);
            this.tokenValid = false;
            this.successMessage = '';
            this.errorMessage = res.message || 'Token invalid or expired.';
          }
        },
        error: (err) => {
          console.error('Error updating password:', err);
          this.tokenValid = false;
          this.successMessage = '';
          this.errorMessage = 'An error occurred while updating the password.';
        },
      });
    } else {
      console.log('Invalid form or passwords do not match');
    }
  }

  onCancel() {
    this.passwordForm.reset();
    this.submitted = false;
  }

  toggleShowNewPassword() {
    this.showNew = !this.showNew;
  }

  toggleShowConfirmPassword() {
    this.showConfirm = !this.showConfirm;
  }

  goBack(): void {
    this.location.back();
  }
}
