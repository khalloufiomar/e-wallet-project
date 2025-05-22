import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Transaction } from '../../model/class/user';
import { TransactionService } from '../../services/transaction.service';
import { NotificationService } from '../../services/notification.service';
import { MessagingService } from '../../services/messaging.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  notificationCount = 0;
  showNotification = false;
  transactions: Transaction[] = [];
  loading: boolean = true;
  dropdownOpen = false;
  constructor(
    private transactionService: TransactionService,
    private notificationservice: NotificationService,
    private messagingservice: MessagingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.messagingservice.newMessageEvent.subscribe(() => {
      this.showNotification = true;
      this.getNotifCount();
    });

    this.getNotifCount();

    this.transactionService.getSelfTransactions().subscribe(
      (data) => {
        console.log(data);
        this.transactions = data
          .sort(
            (a, b) =>
              new Date(b.create_date).getTime() -
              new Date(a.create_date).getTime()
          ) // tri décroissant
          .slice(0, 5); // prend les 3 premières
        this.loading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des transactions', error);
        this.loading = false;
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

  searchText = '';

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  getReport(type: string) {
    this.transactionService.getReport(type).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions.${type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Download error:', error);
      }
    );
  }
  goToNotifications() {
    this.router.navigate(['/user/notifications']);
  }
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  get paginatedTransaction(): Transaction[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.transactions.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.transactions.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
