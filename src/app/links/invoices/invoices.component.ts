import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { InvoicesService } from '../../services/invoices.service';

@Component({
  selector: 'app-invoices',
  imports: [NgClass, CommonModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent {
  invoices: any[] = [];

  constructor(private incoicesService: InvoicesService) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.incoicesService.getAllInvoices().subscribe(
      (data) => {
        this.invoices = data;
        console.log('Factures chargées:', this.invoices);
      },
      (error) => {
        console.error('Erreur lors du chargement des factures :', error);
      }
    );
  }
}
