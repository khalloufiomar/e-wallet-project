import { Component, OnInit } from '@angular/core';
import { Account } from '../../../model/class/user';
import { AccountsadminService } from '../../../services/accountsadmin.service';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../model/class/user';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, effect, inject, PLATFORM_ID } from '@angular/core';
import { DashadminService } from '../../../services/dashadmin.service';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-dashadmin',
  imports: [CommonModule, ChartModule],
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
    private transactionService: TransactionService,
    private cd: ChangeDetectorRef,
    private dashadmin: DashadminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAccounts();
    this.countUserStatus();
    this.loadAccounts();

    this.transactionService.getAllTransactions().subscribe((data) => {
      this.transactions = data;
      this.todayTransactionCount = this.countTodayTransactions(data);
    });

    // 👉 Forcer rechargement du dashboard si on clique à nouveau dessus
    // this.router.events.subscribe((event) => {
    //   if (
    //     event instanceof NavigationEnd &&
    //     event.urlAfterRedirects === '/dashboard'
    //   ) {
    //     // Tu peux ajouter un console.log pour confirmer
    //     console.log('Dashboard clicked again – refreshing data...');
    //     this.fetchAccounts();
    //     this.countUserStatus();
    //     this.loadAccounts();

    //     this.transactionService.getAllTransactions().subscribe((data) => {
    //       this.transactions = data;
    //       this.todayTransactionCount = this.countTodayTransactions(data);
    //     });
    //   }
    // });
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

  countUserStatus(): void {
    // On remet à 0 avant de recompter
    this.activeaccount = 0;
    this.inactiveaccount = 0;

    for (let account of this.accounts) {
      if (account.active === true) {
        this.activeaccount++;
      } else if (account.active === false) {
        this.inactiveaccount++;
      }
    }
  }
  hrcount = 0;
  employeecount = 0;
  learnercount = 0;

  data: any;
  options: any;

  countUserTypes(): void {
    // Remise à zéro
    this.hrcount = 0;
    this.employeecount = 0;
    this.learnercount = 0;

    for (let account of this.accounts) {
      switch (account.type) {
        case 'hr':
          this.hrcount++;
          break;
        case 'employee':
          this.employeecount++;
          break;
        case 'learner':
          this.learnercount++;
          break;
      }
    }
    // Mise à jour du graphique
    this.data = {
      labels: ['HR', 'Employee', 'Learner'],
      datasets: [
        {
          data: [this.hrcount, this.employeecount, this.learnercount],
          backgroundColor: ['#8b5cf6', '#0ea5e9', '#f97316'],
          // backgroundColor: ['#6366f1', '#22c55e', '#facc15'],
        },
      ],
    };
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

  platformId = inject(PLATFORM_ID);

  // initChart(hrCount: number, employeeCount: number, learnerCount: number) {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const documentStyle = getComputedStyle(document.documentElement);
  //     const textColor =
  //       documentStyle.getPropertyValue('--p-text-color') || '#000';
  //     const textColorSecondary =
  //       documentStyle.getPropertyValue('--p-text-muted-color') || '#777';
  //     const surfaceBorder =
  //       documentStyle.getPropertyValue('--p-content-border-color') || '#ccc';

  //     this.data = {
  //       labels: ['HR', 'Employee', 'Learner'],
  //       datasets: [
  //         {
  //           data: [hrCount, employeeCount, learnerCount],
  //           backgroundColor: [
  //             '#8b5cf6', // orange
  //             '#0ea5e9', // cyan
  //             '#f97316', // purple
  //           ],
  //           borderColor: ['#fff', '#fff', '#fff'],
  //           borderWidth: 2,
  //         },
  //       ],
  //     };

  //     this.options = {
  //       plugins: {
  //         legend: {
  //           labels: {
  //             color: textColor,
  //           },
  //         },
  //       },
  //     };

  //     this.cd.markForCheck();
  //   }
  // }

  getPercentage(index: number): string {
    const dataArray: number[] = this.data.datasets[0].data;

    if (!dataArray || dataArray.length === 0) return '0';

    const total: number = dataArray.reduce((a, b) => a + b, 0);
    const value: number = dataArray[index] || 0;

    const percent: number = total > 0 ? (value / total) * 100 : 0;

    return percent.toFixed(0); // Tu peux changer en .toFixed(1) si tu veux 1 décimale
  }

  loadAccounts() {
    this.AccountsadminService.getAllAccounts().subscribe((res) => {
      this.accounts = res;
      this.countUserTypes();
    });
  }
}
