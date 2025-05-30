import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Account, Product } from '../../../model/class/user';
import { AccountsadminService } from '../../../services/accountsadmin.service';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];

  currentPage: number = 1;
  pageSize: number = 5;
  searchTerm: string = '';

  activeaccount = 0;
  inactiveaccount = 0;

  selectedAccount: any = null;
  showDeleteModal = false;
  showFilter = false;

  constructor(private AccountsadminService: AccountsadminService) {}

  ngOnInit(): void {
    this.fetchAccounts();
  }

  fetchAccounts(): void {
    this.AccountsadminService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.filteredAccounts = [...this.accounts];
        this.countUserTypes();
        this.currentPage = 1;
      },
      error: (error) => {
        console.error('Error fetching accounts:', error);
      },
    });
  }

  countUserTypes(): void {
    this.activeaccount = 0;
    this.inactiveaccount = 0;

    for (let account of this.filteredAccounts) {
      if (account.active === true) {
        this.activeaccount++;
      } else if (account.active === false) {
        this.inactiveaccount++;
      }
    }
  }

  toggleStatus(account: any): void {
    account.loading = true;

    const newStatus = account.active === true ? 'Inactive' : 'Active';

    this.AccountsadminService.updateStatus(account.id, 'active').subscribe({
      next: (response) => {
        account.active = newStatus === 'Active';
        account.loading = false;
        this.countUserTypes();
      },
      error: (error) => {
        console.error('❌ Erreur de mise à jour :', error);
        account.loading = false;
      },
    });
  }

  openDeleteModal(account: any): void {
    this.selectedAccount = account;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.selectedAccount = null;
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    this.AccountsadminService.updateStatus(
      this.selectedAccount.id,
      'delete'
    ).subscribe({
      next: () => {
        this.accounts = this.accounts.filter(
          (a) => a.id !== this.selectedAccount.id
        );
        this.filteredAccounts = this.filteredAccounts.filter(
          (a) => a.id !== this.selectedAccount.id
        );
        this.showDeleteModal = false;
        this.selectedAccount = null;
        this.countUserTypes();
      },
      error: (err) => {
        console.error('Erreur de suppression :', err);
        this.showDeleteModal = false;
      },
    });
  }

  toggleFilterDropdown(): void {
    this.showFilter = !this.showFilter;
  }

  filterByType(type: string): void {
    if (type === 'all') {
      this.filteredAccounts = [...this.accounts];
    } else {
      this.filteredAccounts = this.accounts.filter((a) => a.type === type);
    }
    this.countUserTypes();
    this.currentPage = 1;
    this.showFilter = false;
  }

  // 🔢 Pagination
  get totalPages(): number {
    return Math.ceil(this.filteredAccounts.length / this.pageSize);
  }

  get paginatedAccounts(): Account[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAccounts.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
