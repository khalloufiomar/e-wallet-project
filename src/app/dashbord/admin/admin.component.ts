import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLinkActive, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  constructor(private authService: AuthService, private router: Router) {}
  logout() {
    this.authService.logoutCurrentUser().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        // Optionally handle errors (e.g. show a notification)
        this.router.navigate(['/login']); // fallback redirect just in case
      },
    });
  }
}
