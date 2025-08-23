import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.products = response.data.products;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load products';
      }
    });
  }

  toggleVisibility(productId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.toggleVisibility(productId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;

        // Update the local product state
        const product = this.products.find(p => p._id === productId);
        if (product) {
          product.isVisible = response.product.isVisible;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to toggle visibility';
      }
    });
  }

  toggleAvailability(productId: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.toggleAvailability(productId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;

        // Update the local product state
        const product = this.products.find(p => p._id === productId);
        if (product) {
          product.isAvailable = response.product.isAvailable;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to toggle availability';
      }
    });
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isLoading = true;
      this.productService.deleteProduct(productId).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message;
          this.loadProducts(); // Reload the products list
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Failed to delete product';
        }
      });
    }
  }

  getProductStatus(product: Product): string {
    if (product.isVisible && product.isAvailable) {
      return 'Active';
    } else if (!product.isVisible && !product.isAvailable) {
      return 'Inactive';
    } else if (!product.isVisible) {
      return 'Hidden';
    } else {
      return 'Unavailable';
    }
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/images/placeholder-product.jpg';
  }
}
