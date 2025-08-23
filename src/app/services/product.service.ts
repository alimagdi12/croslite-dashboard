import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<{ success: boolean, data: { products: Product[] } }> {
    return this.http.get<{ success: boolean, data: { products: Product[] } }>(`${this.apiUrl}/products`);
  }

  getProduct(id: string): Observable<{ success: boolean, data: { product: Product } }> {
    return this.http.get<{ success: boolean, data: { product: Product } }>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(productData: FormData): Observable<{ success: boolean, message: string, data: { product: Product } }> {
    return this.http.post<{ success: boolean, message: string, data: { product: Product } }>(`${this.apiUrl}/products`, productData);
  }

  updateProduct(id: string, productData: FormData): Observable<{ success: boolean, message: string, data: { product: Product } }> {
    return this.http.put<{ success: boolean, message: string, data: { product: Product } }>(`${this.apiUrl}/products/${id}`, productData);
  }

  deleteProduct(id: string): Observable<{ success: boolean, message: string }> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.apiUrl}/products/${id}`);
  }

  toggleVisibility(productId: string) {
    return this.http.patch<{ success: boolean, message: string, product: Product }>(
      `${this.apiUrl}/products/${productId}/visibility`,
      {}
    );
  }

  toggleAvailability(productId: string) {
    return this.http.patch<{ success: boolean, message: string, product: Product }>(
      `${this.apiUrl}/products/${productId}/availability`,
      {}
    );
  }

}
