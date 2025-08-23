import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: false
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  isLoading = false;
  errorMessage = '';
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];

  // hold product info for toggling
  product: Product | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      arabicTitle: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(400)]],
      details: ['', [Validators.required, Validators.minLength(5)]],
      sizeFrom: ['', [Validators.required, Validators.min(0)]],
      sizeTo: ['', [Validators.required, Validators.min(0)]],
      sizeInLetters: [''],
      sizeInCm: [''],
      size: [''],
      firstColor: ['', Validators.required],
      secondColor: ['', Validators.required],
      rating: [0, [Validators.min(0), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.productService.getProduct(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.product = response.data.product;
        this.productForm.patchValue({
          ...this.product,
          size: this.product.size?.range?.join(',') || ''
        });
        this.imagePreviews = this.product.imageUrl.images;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to load product';
      }
    });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
      this.imagePreviews = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = new FormData();
      const formValue = this.productForm.value;

      Object.keys(formValue).forEach(key => {
        if (key !== 'size' && formValue[key] !== null && formValue[key] !== undefined) {
          formData.append(key, formValue[key]);
        }
      });

      if (formValue.size) {
        formData.append('size', formValue.size);
      }

      this.selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      if (this.isEditMode && this.productId) {
        this.productService.updateProduct(this.productId, formData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Failed to update product';
          }
        });
      } else {
        this.productService.createProduct(formData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Failed to create product';
          }
        });
      }
    }
  }

  // NEW: toggle visibility
  toggleVisibility(): void {
    if (!this.productId) return;
    this.productService.toggleVisibility(this.productId).subscribe({
      next: (res) => {
        if (this.product) {
          this.product.isVisible = res.product.isVisible;
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to toggle visibility');
      }
    });
  }

  // NEW: toggle availability
  toggleAvailability(): void {
    if (!this.productId) return;
    this.productService.toggleAvailability(this.productId).subscribe({
      next: (res) => {
        if (this.product) {
          this.product.isAvailable = res.product.isAvailable;
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to toggle availability');
      }
    });
  }
}
