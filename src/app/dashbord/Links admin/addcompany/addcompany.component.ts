import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Company } from '../../../model/class/user';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-addcompany',
  standalone: true, // Required when using `imports` in components
  imports: [FormsModule, CommonModule],
  templateUrl: './addcompany.component.html',
  styleUrls: ['./addcompany.component.css'],
})
export class AddcompanyComponent implements OnInit {
  companyName: string = '';
  companyEmail: string = '';
  companies: Company[] = [];

  companyCreated: boolean = false;
  errorMessages: string[] = [];
  errorTimer: any = null;

  createdCompany: Company | null = null;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des companies', err);
      },
    });
  }

  addCompany(): void {
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
      this.errorTimer = null;
    }

    this.errorMessages = [];

    if (this.companyName.trim() === '') {
      this.errorMessages.push('Name required');
    }

    if (this.companyEmail.trim() === '') {
      this.errorMessages.push('Email required');
    } else if (!this.isValidEmail(this.companyEmail.trim())) {
      this.errorMessages.push('Email invalid');
    }

    if (this.errorMessages.length > 0) {
      this.errorTimer = setTimeout(() => {
        this.errorMessages = [];
        this.errorTimer = null;
      }, 4000);
      return;
    }

    const newCompany = {
      name: this.companyName.trim(),
      email: this.companyEmail.trim(),
    };

    this.companyService.addCompany(newCompany.name, newCompany.email).subscribe({
      next: (created) => {
        this.companyCreated = true;
        this.createdCompany = created;

        this.companies.push(created);

        this.companyName = '';
        this.companyEmail = '';
      },
      error: (err) => {
        this.errorMessages.push("Erreur lors de la création de l'entreprise.");
        this.errorTimer = setTimeout(() => {
          this.errorMessages = [];
          this.errorTimer = null;
        }, 4000);
        console.error(err);
      },
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
