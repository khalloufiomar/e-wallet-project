import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../links/dashboard/dashboard.component';
@Component({
  selector: 'app-user',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  showTransactions = false;

  handleSeeAll() {
    this.showTransactions = true;
  }
  logout() {
    console.log('Logging out...');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }

  constructor(private authService: AuthService, private router: Router) {}

  userName = '';
  userType = '';
  userEmail = '';
  userBalance = '';
  userId: number = 1;

  ngOnInit(): void {
    this.authService.getCurrentUserInfos().subscribe({
      next: (user) => {
        console.log('Utilisateur récupéré :', user); // <= ici
        this.userId = user.userID;
        this.userName = user.userName;
        this.userType = user.userType;
        this.userEmail = user.userEmail;
        this.userBalance = user.userBalance;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du user :', err);
      },
    });

  }

  isHrCompany(): boolean {
    return this.userType === 'hr';
  }

  isEmployee(): boolean {
    return this.userType === 'employee';
  }

  isLearner(): boolean {
    return this.userType === 'learner';
  }
}
