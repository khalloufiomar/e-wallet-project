import { CommonModule, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { InvoicesService } from '../../services/invoices.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoices',
  imports: [NgClass, CommonModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent {
  invoices: any[] = [];
  selectedInvoice: any = null;

  constructor(
    private incoicesService: InvoicesService,
    private router: Router
  ) {}

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
  openInvoiceDetails(invoice: any): void {
    // Naviguer vers la page de détails de la facture en passant l'ID dans l'URL
    this.router.navigate(['/invoice', invoice.id]);
  }
}
