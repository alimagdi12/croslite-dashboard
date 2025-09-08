import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { AnalyticsSummary, VisitStatistics, ProductClickStats } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) { }

  getVisitStatistics(): Observable<{ message: string; statistics: VisitStatistics }> {
    return this.http.get<{ message: string; statistics: VisitStatistics }>(`${this.apiUrl}/stats`);
  }

  getVisitSummary(): Observable<{ message: string; summary: AnalyticsSummary }> {
    return this.http.get<{ message: string; summary: AnalyticsSummary }>(`${this.apiUrl}/stats/summary`);
  }

  getProductClickStats(): Observable<{ success: boolean; data: ProductClickStats[] }> {
    return this.http.get<{ success: boolean; data: ProductClickStats[] }>(`${this.apiUrl}/product-clicks`);
  }
}
