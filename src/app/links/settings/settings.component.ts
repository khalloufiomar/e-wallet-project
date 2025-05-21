import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { MessagingService } from '../../services/messaging.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  errorMessages: string[] = []; // Messages d'erreur

  notificationCount = 0;
  showNotification = false;
  loading: boolean = true;

  goToNotifications() {
    this.router.navigate(['/user/notifications']);
  }

  getNotifCount() {
    this.notificationservice.getCountUnreadNotifications().subscribe(
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

  constructor(
    private authService: AuthService,
    private messagingService: MessagingService,
    private notificationservice: NotificationService,
    private router: Router
  ) {}
  userName = '';
  userEmail = '';
  phone = '';
  ngOnInit(): void {
    this.messagingService.newMessageEvent.subscribe(() => {
      this.showNotification = true;
      this.getNotifCount();
    });

    this.getNotifCount();
    this.messagingService.requestPermission();
    this.messagingService.listenForMessages();
    this.getCurrentUserInfos();
  }
  getCurrentUserInfos() {
    this.authService.getCurrentUserInfos().subscribe({
      next: (res) => {
        console.log('User info:', res);
        this.userName = res.userName;
        this.userEmail = res.userEmail;
        this.phone = res.phone || '+216';
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      },
    });
  }
  updateUserInfos(userName: string, userEmail: string, phone: string) {
    this.authService.updateUserInfo(userName, userEmail, phone).subscribe({
      next: (res) => {
        this.errorMessages.push('User info updated successfully');
        setTimeout(() => {
          this.errorMessages = [];
        }, 4000);

        console.log('User info updated successfully:', res);
        // Optionally show a success message or refresh the user info
      },
      error: (err) => {
        this.errorMessages.push('Error updating user info');
        setTimeout(() => {
          this.errorMessages = [];
        }, 4000);

        console.error('Error updating user info:', err);
      },
    });
  }
}
