import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ProductService } from '../../../services/product.service';
import { ProductPayload } from '../../../model/class/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-addproduct',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
  ],
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.css',
})
export class AddproductComponent {
  producttitle: string = '';
  productdescription: string = '';
  price: number | null = null;
  selectedFile: File | null = null;
  errorMessages: string[] = [];
  successMessage: string = '';
  productId: number | null = null; // Id du produit en édition, sinon null
  isEditMode = false; // false par défaut (ajout)
  products: ProductPayload[] = [];
  filteredProducts: ProductPayload[] = [];

  imageBase64: string | null = null;
  selectedFileName: string | null = null;
  constructor(private productService: ProductService, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const product = nav?.extras.state?.['product'];

    if (product) {
      this.isEditMode = true;
      this.productId = product.id;
      this.producttitle = product.title || '';
      this.productdescription = product.description || '';
      this.price = product.price || null;
      if (product.image) {
        this.imageBase64 = `data:image/jpeg;base64,${product.image}`;
      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.convertFileToBase64(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.imageBase64 = null;
    }
  }

  convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = reader.result as string;
    };
    reader.onerror = (error) => {
      console.error('Erreur lors de la conversion en Base64', error);
      this.errorMessages = ["Erreur lors de la lecture de l'image."];
      setTimeout(() => {
        this.errorMessages = [];
      }, 4000);
    };
    reader.readAsDataURL(file);
  }

  addproduct() {
    this.errorMessages = [];

    if (!this.producttitle.trim()) {
      this.errorMessages.push('Product title is required.');
    }
    if (!this.productdescription.trim()) {
      this.errorMessages.push('Product description is required.');
    }
    if (this.price === null || this.price < 0) {
      this.errorMessages.push('Price must be a positive number.');
    }
    if (!this.imageBase64) {
      this.errorMessages.push('Please upload a product image.');
    }

    if (this.errorMessages.length > 0) {
      setTimeout(() => {
        this.errorMessages = [];
      }, 4000);
      return;
    }

    const productPayload: ProductPayload = {
      id: this.productId || 0,
      producttitle: this.producttitle,
      productdescription: this.productdescription,
      price: this.price!,
      imageBase64: this.imageBase64!,
    };

    if (this.isEditMode && this.productId) {
      this.productService
        .updateProduct(this.productId, productPayload)
        .subscribe({
          next: () => {
            this.successMessage = 'Product updated successfully!';
            // Efface le message après 4 secondes

            setTimeout(() => {
              this.successMessage = '';
              this.router.navigate(['/admin/product']);
            }, 4000);
          },
          error: (error) => {
            console.error('Error updating product:', error);
            this.errorMessages.push('Failed to update product.');
          },
        });
    } else {
      // Création d'un nouveau produit
      // Après création réussie
      this.productService.addProduct(productPayload).subscribe({
        next: (createdProduct: ProductPayload) => {
          // Ajoute le produit au début du tableau (en gardant la forme ProductPayload)
          this.products.unshift(createdProduct);

          // Si tu utilises filteredProducts, mets-le aussi à jour (même type)
          this.filteredProducts = [...this.products];

          this.successMessage = 'Product created successfully!';
          this.resetForm();

          setTimeout(() => {
            this.successMessage = '';
          }, 4000);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.errorMessages.push('Failed to create product.');
        },
      });
    }
  }

  resetForm() {
    this.producttitle = '';
    this.productdescription = '';
    this.price = null;
    this.selectedFile = null;
    this.imageBase64 = null;
    this.errorMessages = [];

    const fileInput = document.getElementById(
      'imageUpload'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
  goBackToProducts() {
    this.router.navigate(['/products']); // Ou le bon chemin selon ton routing
  }
  cancelEdit() {
    this.isEditMode = false;
    this.productId = null;
    this.resetForm();
  }
}
