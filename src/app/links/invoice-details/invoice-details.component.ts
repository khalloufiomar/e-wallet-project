import { Component, OnInit } from '@angular/core';
import { InvoicesService } from '../../services/invoices.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
@Component({
  selector: 'app-invoice-details',
  imports: [NgClass, CommonModule],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css',
})
export class InvoiceDetailsComponent implements OnInit {
  invoiceId: string = ''; // Pour stocker l'ID de la facture
  invoiceDetails: any = null; // Détails de la facture à afficher

  constructor(
    private route: ActivatedRoute, // Injecter ActivatedRoute pour accéder à l'ID de la facture
    private invoicesService: InvoicesService // Service pour obtenir les factures
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de la facture depuis l'URL
    this.invoiceId = this.route.snapshot.paramMap.get('id')!;

    // Charger les détails de la facture avec cet ID
    this.loadInvoiceDetails(this.invoiceId);
    console.log(this.invoiceId);
  }

  loadInvoiceDetails(invoiceId: string): void {
    this.invoicesService.getInvoiceById(invoiceId).subscribe(
      (data) => {
        this.invoiceDetails = data;
        console.log('Détails de la facture chargés:', this.invoiceDetails);
      },
      (error) => {
        console.error(
          'Erreur lors du chargement des détails de la facture:',
          error
        );
      }
    );
  }
}
