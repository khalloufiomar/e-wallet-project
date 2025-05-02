import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store',
  imports: [CommonModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
})
export class StoreComponent implements OnInit {
  data: any; // Variable pour stocker les données

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    // Appel du service pour récupérer les données
    this.storeService.getData().subscribe(
      (response) => {
        this.data = response; // Stocke la réponse dans la variable data
        console.log(this.data); // Affiche les données dans la console pour vérifier
      },
      (error) => {
        console.error('Erreur de récupération des données', error);
      }
    );
  }
}
