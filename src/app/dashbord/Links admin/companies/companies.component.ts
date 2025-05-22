import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Company } from '../../../model/class/user';
import { Router } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
@Component({
  selector: 'app-companies',
  imports: [CommonModule, FormsModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css',
})
export class CompaniesComponent {
  companies: Company[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  searchTerm: string = '';
  filteredCompanies: Company[] = [];

  constructor(private router: Router, private companyService: CompanyService) {}

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        this.filteredCompanies = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des companies', err);
      },
    });
  }

  filterCompanies() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredCompanies = this.companies.filter((company) =>
      company.name.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredCompanies.length / this.pageSize);
  }

  get paginatedCompanies(): Company[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredCompanies.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onAddCompany() {
    this.router.navigate(['/admin/addcompany']);
  }
}
