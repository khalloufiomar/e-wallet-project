import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Account } from '../../../model/class/user';
import { AccountsadminService } from '../../../services/accountsadmin.service';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent {
  accounts: Account[] = [];

  // 👉 Variables pour stocker les counts par type
  activeaccount = 0;
  inactiveaccount = 0;

  constructor(private AccountsadminService: AccountsadminService) {}

  ngOnInit(): void {
    this.fetchAccounts();
    this.countUserTypes();
  }

  fetchAccounts(): void {
    this.AccountsadminService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        console.log('Accounts loaded:', data);
        this.filteredAccounts = [...this.accounts];
        this.countUserTypes();
      },
      error: (error) => {
        console.error('Error fetching accounts:', error);
      },
    });
  }

  countUserTypes(): void {
    // On remet à 0 avant de recompter
    this.activeaccount = 0;
    this.inactiveaccount = 0;

    for (let account of this.filteredAccounts) {
      if (account.status === 'Active') {
        this.activeaccount++;
      } else if (account.status === 'Inactive') {
        this.inactiveaccount++;
      }
    }
  }

  toggleStatus(account: any): void {
    account.loading = true;

    const newStatus = account.status === 'Active' ? 'Inactive' : 'Active';
    console.log(
      `🔄 Tentative de changement de statut pour ${account.id} → ${newStatus}`
    );

    this.AccountsadminService.updateStatus(account.id, newStatus).subscribe({
      next: (response) => {
        console.log('✅ Réponse du serveur :', response);
        account.status = newStatus;
        account.loading = false;
        this.countUserTypes();
      },
      error: (error) => {
        console.error('❌ Erreur de mise à jour :', error);
        account.loading = false;
      },
    });
  }

  selectedAccount: any = null;
  showDeleteModal = false;

  openDeleteModal(account: any): void {
    this.selectedAccount = account;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.selectedAccount = null;
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    this.AccountsadminService.deleteAccount(this.selectedAccount.id).subscribe({
      next: () => {
        this.accounts = this.accounts.filter(
          (a: any) => a.id !== this.selectedAccount.id
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

  showFilter = false;
  filteredAccounts: any[] = [];

  toggleFilterDropdown(): void {
    this.showFilter = !this.showFilter;
  }

  filterByType(type: string): void {
    if (type === 'all') {
      this.filteredAccounts = [...this.accounts];
    } else {
      this.filteredAccounts = this.accounts.filter((a) => a.type === type);
    }
    this.countUserTypes(); // Mettre à jour les compteurs après filtrage
    this.showFilter = false;
  }
}
