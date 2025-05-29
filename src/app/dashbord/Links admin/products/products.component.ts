import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { MessagingService } from '../../../services/messaging.service';
import { Router } from '@angular/router';
import { Product } from '../../../model/class/user';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  notificationCount = 0;
  showNotification = false;
  loading: boolean = true;
  searchTerm: string = '';
  constructor(
    private notificationservice: NotificationService,
    private messagingservice: MessagingService,
    private router: Router,
    private productService: ProductService
  ) {}

  products: Product[] = [];
  filteredProducts: Product[] = [];

  ngOnInit(): void {
    this.loading = true;
    this.messagingservice.newMessageEvent.subscribe(() => {
      this.showNotification = true;
      this.getNotifCount();
    });

    this.getNotifCount();
    this.productService.getProducts().subscribe(
      (response: any[]) => {
        this.products = response;

        for (let product of this.products) {
          const base64String = product.image;
          const imageSrc = `data:image/jpeg;base64,${base64String}`;
          product.image = imageSrc; // ajoute une propriété pour l'affichage
        }

        this.filteredProducts = [...this.products]; // si tu filtres
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    );
  }

  // Bonus: fallback image
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/products/default.png';
  }

  editProduct(product: Product) {
    alert('Edit: ' + product.title);
  }

  deleteProduct(product: Product) {
    this.products = this.products.filter((p) => p !== product);
  }

  getNotifCount() {
    this.notificationservice.getCountUnreadNotifications().subscribe(
      (data) => {
        this.notificationCount = data.notifCount;
        this.showNotification = this.notificationCount > 0;
        console.log(this.notificationCount);
      },
      (error) => {
        console.error('Erreur', error);
      }
    );
  }
  resetNotificationState() {
    this.notificationCount = 0;
    this.showNotification = false;
  }
  goToNotifications() {
    this.router.navigate(['/admin/notifications']);
  }
}
