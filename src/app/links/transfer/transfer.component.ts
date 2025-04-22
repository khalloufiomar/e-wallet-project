import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { TransferService, Employee } from '../../services/transfer.service';
import { Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-transfer',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css',
})
export class TransferComponent implements OnInit {
  transferForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessages: string[] = [];
  isLoading = false;
  recentTransfers: any[] = [];

  userName = '';
  userType = '';
  userEmail = '';
  userBalance = '';
  userId: number = 1;
  employees: Employee[] = [];
  constructor(
    private fb: FormBuilder,
    private transferService: TransferService,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    //Retrive user infos on load
    this.authservice.getCurrentUserInfos().subscribe({
      next: (user) => {
        console.log('Utilisateur récupéré :', user); // <= ici
        this.userId = user.userID;
        this.userName = user.userName;
        this.userType = user.userType;
        this.userEmail = user.userEmail;
        this.userBalance = user.userBalance;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du user :', err);
      },
    });

    //Retrive recent transfers on load
    this.getRecentTransfers();

    //Get Employees and their Wallets on Load
    this.transferService.getEmpsWallet().subscribe({
      next: (data) => {
        console.log('Employees wallets retrived :', data); // <= ici
        this.employees = data;
        console.log('Employees array: ', this.employees);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du wallets :', err);
      },
    });

    this.transferForm = this.fb.group({
      recipientWalletId: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')],
      ],
      amount: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')],
      ],
      description: [''],
    });
  }

  get f() {
    return this.transferForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessages = [];
    this.successMessage = '';

    if (this.transferForm.invalid) {
      if (this.f['recipientWalletId'].errors?.['required']) {
        this.errorMessages.push('Recipient ID is required.');
      }
      if (this.f['recipientWalletId'].errors?.['pattern']) {
        this.errorMessages.push(
          'Recipient ID must only contain letters and numbers.'
        );
      }
      if (this.f['amount'].errors?.['required']) {
        this.errorMessages.push('Amount is required.');
      }
      if (this.f['amount'].errors?.['pattern']) {
        this.errorMessages.push('Amount must be a valid number.');
      }
      return;
    }

    this.isLoading = true;

    const formData = {
      recipientWalletId: this.transferForm.value.recipientWalletId,
      amount: +this.transferForm.value.amount,
      description: this.transferForm.value.description,
    };

    this.transferService.sendCoins(formData).subscribe({
      next: () => {
        this.successMessage = 'Transfer successful!';
        this.transferForm.reset();
        this.submitted = false;
        this.isLoading = false;

        setTimeout(() => {
          this.successMessage = '';
        }, 4000);
      },
      error: (err) => {
        this.errorMessages = ['Transfer failed. Please try again.'];
        this.isLoading = false;

        setTimeout(() => {
          this.errorMessages = [];
        }, 4000);

        console.error(err);
      },
    });
    console.log(formData);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  getRecentTransfers(): void {
    this.transferService.getLastTransfers().subscribe({
      next: (transfers) => {
        this.recentTransfers = transfers
          .sort(
            (a, b) =>
              new Date(b.create_date).getTime() -
              new Date(a.create_date).getTime()
          )
          .slice(0, 3);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des transferts récents', err);
      },
    });
  }
}
