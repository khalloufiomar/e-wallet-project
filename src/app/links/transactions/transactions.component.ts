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
  transaction: Transaction[] = [];

  // Typage : Invoice devrait être importé et défini
  filteredInvoices: Transaction[] = [];
  showFilter: boolean = false;
  selectedPaymentFilter: string = 'all'; // état du filtre actuel
  currentPage: number = 1;
  pageSize: number = 5; // nombre d'éléments par page

  get totalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.pageSize) || 1;
  }

  get paginatedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTransactions.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  selectedInvoice: any = null;
  filteredTransactions: Transaction[] = [];

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
        this.transactions = data.sort(
          (a, b) =>
            new Date(b.create_date).getTime() -
            new Date(a.create_date).getTime()
        ); // tri décroissant
        // prend les 3 premières
        this.filteredTransactions = data; // Initialement pas filtré
        this.currentPage = 1;
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
  toggleFilterDropdown() {
    this.showFilter = !this.showFilter;
  }

  filterByCategory(category: string) {
    this.selectedPaymentFilter = category;
    this.applyFilters();
    this.showFilter = false; // ferme le dropdown après sélection
  }

  applyFilters() {
    if (this.selectedPaymentFilter === 'all') {
      this.filteredInvoices = this.transactions;
    } else {
      this.filteredInvoices = this.transactions.filter(
        (transaction) => transaction.category === this.selectedPaymentFilter
      );
    }
    this.currentPage = 1; // reset page à 1 après filtre
  }
}
