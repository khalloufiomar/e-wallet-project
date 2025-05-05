import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  imports: [NgClass, NgFor, CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notificationService: NotificationService) {}
  isLoading = true;

  ngOnInit(): void {
    this.loadNotifications();
    this.markAllAsRead();
  }

  markAllAsRead(): void {
    this.notificationService.markAllNotificationsAsRead().subscribe(
      () => {
        
      },
      (error) => {
        console.error('Erreur lors de la mise à jour des notifications', error);
      }
    );
  }

  loadNotifications(): void {
    this.isLoading = true;

    this.notificationService.getNotifications().subscribe(
      (data) => {
        this.notifications = data.sort(
          (a, b) => new Date(b.create_date).getTime() - new Date(a.create_date).getTime()
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
  
}
