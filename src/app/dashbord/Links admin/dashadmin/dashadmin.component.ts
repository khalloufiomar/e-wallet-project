import { Component, OnInit } from '@angular/core';
import { Account } from '../../../model/class/user';
import { AccountsadminService } from '../../../services/accountsadmin.service';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../model/class/user';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-dashadmin',
  imports: [CommonModule],
  templateUrl: './dashadmin.component.html',
  styleUrl: './dashadmin.component.css',
})
export class DashadminComponent implements OnInit {
  accounts: Account[] = [];

  // 👉 Variables pour stocker les counts par type
  activeaccount = 0;
  inactiveaccount = 0;

  constructor(
    private AccountsadminService: AccountsadminService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.fetchAccounts();
    this.countUserTypes();

    this.transactionService.getAllTransactions().subscribe((data) => {
      this.transactions = data;
      this.todayTransactionCount = this.countTodayTransactions(data);
    });
  }
  fetchAccounts(): void {
    this.AccountsadminService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        console.log('Accounts loaded:', data);
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

    for (let account of this.accounts) {
      if (account.status === 'Active') {
        this.activeaccount++;
      } else if (account.status === 'Inactive') {
        this.inactiveaccount++;
      }
    }
  }

  get totalBalance(): number {
    return this.accounts.reduce((sum, user) => sum + user.balance, 0);
  }

  transactions: Transaction[] = [];
  todayTransactionCount: number = 0;

  private countTodayTransactions(transactions: Transaction[]): number {
    const today = new Date();
    return transactions.filter((tx) => {
      const txDate = new Date(tx.create_date);
      return (
        txDate.getDate() === today.getDate() &&
        txDate.getMonth() === today.getMonth() &&
        txDate.getFullYear() === today.getFullYear()
      );
    }).length;
  }
}
