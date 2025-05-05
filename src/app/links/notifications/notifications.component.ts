import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { MessagingService } from '../../services/messaging.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  imports: [NgClass, NgFor, CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  notificationCount = 0;
  showNotification = false;
  constructor(
    private notificationservice: NotificationService,
    private messagingservice: MessagingService,
    private router: Router
  ) {}
  isLoading = true;

  ngOnInit(): void {
    this.loadNotifications();
    this.markAllAsRead();
    this.messagingservice.newMessageEvent.subscribe(() => {
      this.showNotification = true;
      this.getNotifCount();
    });

    this.getNotifCount();
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

  markAllAsRead(): void {
    this.notificationservice.markAllNotificationsAsRead().subscribe(
      () => {},
      (error) => {
        console.error('Erreur lors de la mise à jour des notifications', error);
      }
    );
  }

  loadNotifications(): void {
    this.isLoading = true;

    this.notificationservice.getNotifications().subscribe(
      (data) => {
        this.notifications = data.sort(
          (a, b) =>
            new Date(b.create_date).getTime() -
            new Date(a.create_date).getTime()
        );
        this.isLoading = false;
        console.log(data);
      },
      (error) => {
        console.error('Erreur de récupération des notifications', error);
        this.isLoading = false;
      }
    );
  }
  goToNotifications() {
    this.router.navigate(['/user/notifications']);
  }
}
