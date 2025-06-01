import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';
import { MessagingService } from '../../../services/messaging.service';
import { Router } from '@angular/router';
import { Product } from '../../../model/class/user';
import { ProductService } from '../../../services/product.service';
import { ProductPayload } from '../../../model/class/user';
@Component({
  selector: 'app-products',
  imports: [FormsModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  notificationCount = 0;
  showNotification = false;
  loading = true;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  showDeleteModal = false;

  constructor(
    private notificationService: NotificationService,
    private messagingService: MessagingService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    // Notifications
    this.messagingService.newMessageEvent.subscribe(() => {
      this.showNotification = true;
      this.getNotifCount();
    });
    this.getNotifCount();

    // Récupération des produits
    this.productService.getProducts().subscribe({
      next: (response: ProductPayload[]) => {
        console.log('Produits récupérés :', response);
        // <-- ici on indique que c’est ProductPayload[]
        this.products = response.map((productPayload) => ({
          id: productPayload.id,
          title: productPayload.name,
          description: productPayload.description,
          price: productPayload.price_lc,
          image: `data:image/jpeg;base64,${productPayload.image}`,
          category: productPayload.category, // conversion base64
          active: productPayload.active,
        }));
        this.filteredProducts = [...this.products];
        this.loading = false;
        console.log('Produits :', this.products);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des produits :', error);
        this.loading = false;
      },
    });
  }

  getNotifCount(): void {
    this.notificationService.getCountUnreadNotifications().subscribe({
      next: (data) => {
        this.notificationCount = data.notifCount;
        this.showNotification = this.notificationCount > 0;
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération des notifications :',
          error
        );
      },
    });
  }

  resetNotificationState(): void {
    this.notificationCount = 0;
    this.showNotification = false;
  }

  goToNotifications(): void {
    this.router.navigate(['/admin/notifications']);
  }

  // Gestion suppression
  openDeleteModal(product: Product): void {
    this.selectedProduct = product;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.selectedProduct = null;
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (!this.selectedProduct) return;

    this.productService.activateDeactivateProduct(this.selectedProduct.id).subscribe({
      next: () => {
        this.cancelDelete();
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      },
      error: (err) => {
        console.error('Erreur lors de la suppression du produit :', err);
      },
    });
  }

  // Redirection ajout
  goToAddProduct(): void {
    this.router.navigate(['/admin/addproduct']);
  }

  // Redirection modification
  editProduct(product: Product): void {
    this.router.navigate(['/admin/addproduct'], {
      state: { product },
    });
  }

  // Image fallback
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/products/default.png';
  }
  filterProducts() {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredProducts = this.products.filter(
      (product) =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
  }
  private _searchTerm: string = '';

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filterProducts(); // 🔍 filtre à chaque changement
  }
}
