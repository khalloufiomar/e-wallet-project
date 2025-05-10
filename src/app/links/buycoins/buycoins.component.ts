import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BuycoinsService } from '../../services/buycoins.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-buycoins',
  imports: [CommonModule, FormsModule],
  templateUrl: './buycoins.component.html',
  styleUrl: './buycoins.component.css',
})
export class BuyCoinsComponent implements OnInit {
  notifications: any[] = [];
  notificationCount = 0;
  showNotification = false;
  isLoading = true;
  userName = '';
  userType = '';
  userEmail = '';
  userBalance = '';
  userId: number = 1;
  constructor(
    private authservice: AuthService,
    private buyCoinsService: BuycoinsService,
    private router: Router,
    private notificationservice: NotificationService
  ) {}
  ngOnInit(): void {
    this.loadNotifications();
    this.markAllAsRead();
    this.authservice.getCurrentUserInfos().subscribe({
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

  coinAmount: number = 0.0;
  totalPrice: number = 0;

  calculateTotal() {
    // Exemple de calcul du total
    this.totalPrice = this.coinAmount * 1; // Par exemple, chaque coin coûte 0.5 Dinars
  }

  responseMessage: string = '';
  errorMessage: string = '';
  submitCoinAmount(): void {
    this.responseMessage = '';
    this.errorMessage = '';

    if (this.coinAmount > 0) {
      this.buyCoinsService.getInvoiceByQuantity(this.coinAmount).subscribe(
        (response) => {
          console.log('Réponse API :', response);
          this.responseMessage = 'Facture générée avec succès.';
          this.router.navigate(['/user/invoices']);
        },
        (error) => {
          console.error('Erreur API :', error);
          this.errorMessage = 'Une erreur est survenue.';
        }
      );
    } else {
      this.errorMessage = 'Veuillez entrer un nombre valide.';
    }
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
