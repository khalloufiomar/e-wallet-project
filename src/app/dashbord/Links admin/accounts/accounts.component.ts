import { Component, OnInit } from '@angular/core';
import { AccountsadminService } from '../../../services/accountsadmin.service';
import { Account } from '../../../model/class/user';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-accounts',
  imports: [CommonModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];

  // 👉 Variables pour stocker les counts par type
  learnerCount = 0;
  hrCompanyCount = 0;
  employeeCount = 0;

  constructor(private AccountsadminService: AccountsadminService) {}

  ngOnInit(): void {
    this.fetchAccounts();
  }

  fetchAccounts(): void {
    this.AccountsadminService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        console.log('Accounts loaded:', data);
        this.countUserTypes(); // 👉 On compte dès que les données sont récupérées
      },
      error: (error) => {
        console.error('Error fetching accounts:', error);
      },
    });
  }

  countUserTypes(): void {
    // On remet à 0 avant de recompter
    this.learnerCount = 0;
    this.hrCompanyCount = 0;
    this.employeeCount = 0;

    for (let account of this.accounts) {
      if (account.type.toLowerCase() === 'learner') {
        this.learnerCount++;
      } else if (account.type.toLowerCase() === 'hrcompany') {
        this.hrCompanyCount++;
      } else if (account.type.toLowerCase() === 'employee') {
        this.employeeCount++;
      }
    }
  }
}
