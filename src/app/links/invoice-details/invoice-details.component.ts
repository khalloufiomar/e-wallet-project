import { Component, OnInit } from '@angular/core';
import { InvoicesService } from '../../services/invoices.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import {
  ICreateOrderRequest,
  IPayPalConfig,
  NgxPayPalModule,
} from 'ngx-paypal';
import { Router } from '@angular/router';
@Component({
  selector: 'app-invoice-details',
  imports: [NgClass, CommonModule, NgxPayPalModule],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css',
})
export class InvoiceDetailsComponent implements OnInit {
  invoiceId: string = ''; // Pour stocker l'ID de la facture
  invoiceDetails: any = null; // Détails de la facture à afficher

  constructor(
    private route: ActivatedRoute, // Injecter ActivatedRoute pour accéder à l'ID de la facture
    private invoicesService: InvoicesService, // Service pour obtenir les factures
    private router: Router
  ) {}
  public payPalConfig?: IPayPalConfig;
  ngOnInit(): void {
    // Récupérer l'ID de la facture depuis l'URL
    this.invoiceId = this.route.snapshot.paramMap.get('id')!;

    // Charger les détails de la facture avec cet ID
    this.loadInvoiceDetails(this.invoiceId);
    this.initConfig();
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
  //This bloc is responsible for the payment logic of the Paypal Buttons
  private initConfig(): void {
    const component = this;
    this.payPalConfig = {
      currency: 'USD',
      clientId:
        'AdkAgKhLGFuGf9K3hiBKvdat45f4wBbUuJU7Zm26Sx_C4PsrjMtzNrSCw4HWaJS-w2oHwlGLmWcLpRIn',
      createOrderOnServer: () => {
        return fetch(
          `http://localhost:8069/fund_wallet/${this.invoiceId}/pay_invoice`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.id) {
              return data.id;
            } else {
              throw new Error('Order creation failed: ' + JSON.stringify(data));
            }
          });
      },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: async (data, actions) => {
        console.log('onApprove - transaction was approved, now capturing...');

        try {
          const response = await fetch(
            `http://localhost:8069/api/orders/${data.orderID}/capture`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            }
          );

          const orderData = await response.json();
          const errorDetail = orderData?.details?.[0];

          if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
            // (1) Recoverable error: try again
            return actions.restart();
          } else if (errorDetail) {
            // (2) Non-recoverable error: show failure
            throw new Error(
              `${errorDetail.description} (${orderData.debug_id})`
            );
          } else if (!orderData.purchase_units) {
            // (3) Unexpected response structure
            throw new Error(JSON.stringify(orderData));
          } else {
            // (4) Success: show transaction confirmation
            const transaction =
              orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
              orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];

            console.log(
              `Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all details.`,
              orderData
            );

            // Optional: replace with a modal, toast, or Angular route redirection
            alert(
              `Transaction ${transaction.status}: ${transaction.id}\n\nSee console for details.`
            );
          }
        } catch (error: any) {
          console.error('Capture error:', error);
          alert(
            `Sorry, your transaction could not be processed...\n\n${
              error?.message || error
            }`
          );
        }
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
