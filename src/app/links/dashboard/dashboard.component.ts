import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { MessagingService } from '../../services/messaging.service';
import { Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // transactions: any[] = [];
  notificationCount = 0;
  showNotification = false;
  tndAmount: number = 50; // Montant en TND
  ctAmount: number = 50; // Montant en CT
  loading: boolean = true;
  convertToCT(): void {
    const conversionRate = 1; // 1 TND = 1 CT
    this.ctAmount = this.tndAmount * conversionRate;
  }

  userName = '';
  userType = '';
  userEmail = '';
  userBalance = '';
  userId: number = 1;
  companyCode = '';
  transactions: any[] = [];
  showCode: boolean = false;
  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router,
    private messagingService: MessagingService,
    private notificationservice: NotificationService
  ) {}
  toggleCode() {
    this.showCode = !this.showCode;
  }
  ngOnInit(): void {
    this.messagingService.newMessageEvent.subscribe(() => {
      this.showNotification = true;
      this.getNotifCount();
    });

    this.getNotifCount();
    this.messagingService.requestPermission();
    this.messagingService.listenForMessages();
    this.authService.getCurrentUserInfos().subscribe({
      next: (user) => {
        console.log('Utilisateur récupéré :', user);
        this.userId = user.userID;
        this.userName = user.userName;
        this.userType = user.userType;
        this.userEmail = user.userEmail;
        this.userBalance = user.userBalance;
        if (this.userType == 'hr') {
          this.companyCode = user.companyCode;
        }
        // ✅ Récupérer les 3 dernières transactions
        this.transactionService.getSelfTransactions().subscribe(
          (data) => {
            console.log(data);
            this.transactions = data
              .sort(
                (a, b) =>
                  new Date(b.create_date).getTime() -
                  new Date(a.create_date).getTime()
              ) // tri décroissant
              .slice(0, 3); // prend les 3 premières
            this.loading = false;
          },
          (error) => {
            console.error(
              'Erreur lors de la récupération des transactions',
              error
            );
            this.loading = false;
            this.router.navigate(['/login']);
          }
        );
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du user :', err);
        this.router.navigate(['/login']);
      },
    });
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
  triggerSeeAll() {
    this.router.navigate(['/user/transactions']);
  }
  goToBuyCoins() {
    this.router.navigate(['/user/buyCoins']);
  }

  goToTransfer() {
    this.router.navigate(['/user/transfer']);
  }

  goToTransactions() {
    this.router.navigate(['/user/transactions']);
  }
  goToNotifications() {
    this.router.navigate(['/user/notifications']);
  }
  goToSettings() {
    this.router.navigate(['/user/settings']);
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
  triggerTransfer() {
    this.router.navigate(['/user/transfer']);
  }
  triggerStore() {
    this.router.navigate(['/user/store']);
  }
  triggerBuyCoins() {
    this.router.navigate(['/user/BuyCoins']);
  }
}
