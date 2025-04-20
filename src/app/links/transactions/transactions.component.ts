import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Transaction } from '../../model/class/user';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  transactions: Transaction[] = [];
  loading: boolean = true;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loading = true;

    this.transactionService.getTransactionsByUser().subscribe(
      (data) => {
        console.log(data)
        this.transactions = data
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ) // tri décroissant
          .slice(0, 3); // prend les 3 premières
        this.loading = false;
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des transactions',
          error
        );
        this.loading = false;
      }
    );
    
  }

  searchText = '';

  changePage(direction: string) {
    console.log('Change page: ', direction);
  }
}
