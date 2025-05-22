import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Company } from '../../../model/class/user';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-addcompany',
  imports: [FormsModule, CommonModule],
  templateUrl: './addcompany.component.html',
  styleUrl: './addcompany.component.css',
})
export class AddcompanyComponent implements OnInit {
  companyName: string = '';
  companyEmail: string = '';
  companies: Company[] = [];

  companyCreated: boolean = false;
  errorMessages: string[] = [];
  errorTimer: any = null;

  createdCompany: Company = {
    name: '',
    companyCode: '',
    companyEmail: '',
    createdAt: new Date(),
  };

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    // Chargement de la liste des sociétés depuis le backend
    this.companyService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des companies', err);
      },
    });
  }

  // Génère un code unique qui ne doit pas déjà exister dans companies
  generateUniqueCompanyCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newCode = '';
    let isUnique = false;

    while (!isUnique) {
      newCode = Array.from(
        { length: 6 },
        () => characters[Math.floor(Math.random() * characters.length)]
      ).join('');

      // Vérifie que le code n'existe pas déjà
      isUnique = !this.companies.some(
        (company) => company.companyCode === newCode
      );
    }

    return newCode;
  }

  addCompany(): void {
    // Nettoyer l'ancien timer d'erreur
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
      this.errorTimer = null;
    }

    this.errorMessages = [];

    // Validation des champs
    if (this.companyName.trim() === '') {
      this.errorMessages.push('Name required');
    }

    if (this.companyEmail.trim() === '') {
      this.errorMessages.push('Email required');
    } else if (!this.isValidEmail(this.companyEmail.trim())) {
      this.errorMessages.push('Email invalid');
    }

    // Vérifier si l'email existe déjà dans la liste
    const emailExists = this.companies.some(
      (c) =>
        c.companyEmail.toLowerCase() === this.companyEmail.trim().toLowerCase()
    );

    if (emailExists) {
      this.errorMessages.push('This email is already used by another company.');
    }

    // S'il y a des erreurs, afficher temporairement les messages
    if (this.errorMessages.length > 0) {
      this.errorTimer = setTimeout(() => {
        this.errorMessages = [];
        this.errorTimer = null;
      }, 4000);
      return;
    }

    // Préparer la nouvelle société
    const newCompany: Company = {
      name: this.companyName.trim(),
      companyCode: this.generateUniqueCompanyCode(),
      companyEmail: this.companyEmail.trim(),
      createdAt: new Date(),
    };

    // Appel au backend pour ajouter la société
    this.companyService.addCompany(newCompany).subscribe({
      next: (created) => {
        this.companyCreated = true;
        this.createdCompany = created;

        // Mettre à jour la liste locale
        this.companies.push(created);

        // Réinitialiser les champs du formulaire
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
  // Validation simple de l'email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
