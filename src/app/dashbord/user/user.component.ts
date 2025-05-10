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
import { MessagingService } from '../../services/messaging.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-user',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  showTransactions = true;
  notificationCount = 100;
  showNotification = false;
  handleSeeAll() {
    this.showTransactions = true;
  }
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private messagingService: MessagingService,
    private notificationService: NotificationService
  ) {}

  userName = '';
  userType = '';
  userEmail = '';
  userBalance = '';
  userId: number = 1;
  companyCode = '';
  ngOnInit(): void {
    this.messagingService.newMessageEvent.subscribe(() => {
      this.showNotification = true;
      this.getNotifCount();
    });

    this.getNotifCount();

    this.authService.getCurrentUserInfos().subscribe({
      next: (user) => {
        console.log('Utilisateur récupéré :', user); // <= ici
        this.userId = user.userID;
        this.userName = user.userName;
        this.userType = user.userType;
        this.userEmail = user.userEmail;
        this.userBalance = user.userBalance;
        if (this.userType == 'hr') {
          this.companyCode = user.companyCode;
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du user :', err);
      },
    });
  }
  getNotifCount() {
    this.notificationService.getCountUnreadNotifications().subscribe(
      (data) => {
        this.notificationCount = data.notifCount;
        this.showNotification = this.notificationCount > 0;
        console.log(this.notificationCount);
      },
      (error) => {
        console.error('Erreur', error);
      }
    );
  }
  resetNotificationState() {
    this.notificationCount = 0;
    this.showNotification = false;
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
