import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store',
  imports: [CommonModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
})
export class StoreComponent implements OnInit {
  notifications: any[] = [];
  notificationCount = 0;
  showNotification = false;
  isLoading = true;
  data: any; // Variable pour stocker les données

  constructor(
    private storeService: StoreService,
    private notificationservice: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.markAllAsRead();
    // Appel du service pour récupérer les données
    this.storeService.getData().subscribe(
      (response) => {
        this.data = response; // Stocke la réponse dans la variable data
        console.log(this.data); // Affiche les données dans la console pour vérifier
      },
      (error) => {
        console.error('Erreur de récupération des données', error);
      }
    );
  }
  purchaseCourse(courseId: string) {
    this.storeService.purchaseCourse(courseId).subscribe(
      (response) => {
        console.log('Achat effectué avec succès', response);
        alert('Purchase successfully completed!');
        window.location.reload();
      },
      (error) => {
        console.error('Erreur lors de lachat du cours', error);
      }
    );
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
