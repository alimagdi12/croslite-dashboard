import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { AnalyticsSummary, VisitStatistics, ProductClickStats } from '../../models/analytics.model';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  standalone: false
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('countryChart') countryChartRef!: ElementRef;
  @ViewChild('governorateChart') governorateChartRef!: ElementRef;
  @ViewChild('productChart') productChartRef!: ElementRef;

  summary!: AnalyticsSummary;
  statistics!: VisitStatistics;
  productStats: ProductClickStats[] = [];
  isLoading = true;
  errorMessage = '';
  chartsReady = false;

  private countryChart: any;
  private governorateChart: any;
  private productChart: any;

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    // If data is already loaded, create charts
    if (this.statistics && this.productStats.length > 0) {
      this.createCharts();
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.analyticsService.getVisitSummary().subscribe({
      next: (response) => {
        this.summary = response.summary;
        this.loadStatistics();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load dashboard data';
        console.error('Error loading summary:', error);
      }
    });
  }

  loadStatistics(): void {
    this.analyticsService.getVisitStatistics().subscribe({
      next: (response) => {
        this.statistics = response.statistics;
        this.loadProductStats();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load statistics';
        console.error('Error loading statistics:', error);
      }
    });
  }

  loadProductStats(): void {
  this.analyticsService.getProductClickStats().subscribe({
    next: (response: any) => {
      // Handle both response formats
      this.productStats = response.success ? response.data : response;
      console.log('Product stats loaded:', this.productStats);
      this.createCharts();
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      this.isLoading = false;
      console.error('Error loading product stats:', error);
    }
  });
}

  createCharts(): void {
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      this.createCountryChart();
      this.createGovernorateChart();
      this.createProductChart();
    }, 100);
  }

  createCountryChart(): void {
    if (!this.countryChartRef?.nativeElement) {
      console.error('Country chart canvas not found');
      return;
    }

    if (this.countryChart) {
      this.countryChart.destroy();
    }

    try {
      this.countryChart = new Chart(this.countryChartRef.nativeElement, {
        type: 'pie',
        data: {
          labels: this.statistics.topCountries.map(c => c.country),
          datasets: [{
            label: 'Visits',
            data: this.statistics.topCountries.map(c => c.visits),
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      } as any);
    } catch (error) {
      console.error('Error creating country chart:', error);
    }
  }

  createGovernorateChart(): void {
    if (!this.governorateChartRef?.nativeElement) {
      console.error('Governorate chart canvas not found');
      return;
    }

    if (this.governorateChart) {
      this.governorateChart.destroy();
    }

    try {
      this.governorateChart = new Chart(this.governorateChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: this.statistics.topGovernorates.map(g => g.governorate),
          datasets: [{
            label: 'Visits',
            data: this.statistics.topGovernorates.map(g => g.visits),
            backgroundColor: [
              '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
              '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384', '#36A2EB'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      } as any);
    } catch (error) {
      console.error('Error creating governorate chart:', error);
    }
  }

  createProductChart(): void {
    if (!this.productChartRef?.nativeElement) {
      console.error('Product chart canvas not found');
      return;
    }

    if (this.productChart) {
      this.productChart.destroy();
    }

    try {
      const topProducts = this.productStats.slice(0, 10);

      this.productChart = new Chart(this.productChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: topProducts.map(p => p.title),
          datasets: [{
            label: 'Clicks',
            data: topProducts.map(p => p.clicks),
            backgroundColor: '#4BC0C0',
            borderColor: '#4BC0C0',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }
      } as any);
    } catch (error) {
      console.error('Error creating product chart:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.countryChart) {
      this.countryChart.destroy();
    }
    if (this.governorateChart) {
      this.governorateChart.destroy();
    }
    if (this.productChart) {
      this.productChart.destroy();
    }
  }
}
