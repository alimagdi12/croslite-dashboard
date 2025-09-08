import { Component, OnInit, OnDestroy } from '@angular/core';
import { LiveVisitorsService, LiveVisitorsData, LiveVisitor } from '../../services/live-visitors.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-live-visitors',
  templateUrl: './live-visitors.component.html',
  styleUrls: ['./live-visitors.component.scss'],
  standalone: false
})
export class LiveVisitorsComponent implements OnInit, OnDestroy {
  liveVisitorsData: LiveVisitorsData = { count: 0, visitors: [] };
  isConnected = false;
  isLoading = true;
  now: Date = new Date(); // Add this property

  private visitorsSubscription!: Subscription;
  private connectionSubscription!: Subscription;
  private timeInterval: any;

  constructor(private liveVisitorsService: LiveVisitorsService) {}

  ngOnInit(): void {
    // Update time every second
    this.timeInterval = setInterval(() => {
      this.now = new Date();
    }, 1000);

    // Subscribe to live visitors updates
    this.visitorsSubscription = this.liveVisitorsService.liveVisitors$.subscribe({
      next: (data) => {
        this.liveVisitorsData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error receiving live visitors:', error);
        this.isLoading = false;
      }
    });

    // Subscribe to connection status
    this.connectionSubscription = this.liveVisitorsService.connectionStatus$.subscribe({
      next: (status) => {
        this.isConnected = status;
      },
      error: (error) => {
        console.error('Error receiving connection status:', error);
      }
    });

    // Load initial data via HTTP as fallback
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.liveVisitorsService.getLiveVisitorsHttp().subscribe({
      next: (response) => {
        if (response.success) {
          this.liveVisitorsData = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading initial data:', error);
        this.isLoading = false;
      }
    });
  }

  // Add the missing methods that are used in the template
  getDeviceCount(type: string): number {
    return this.liveVisitorsData.visitors.filter(visitor => {
      const agent = visitor.userAgent?.toLowerCase() || '';
      switch (type) {
        case 'desktop':
          return !/mobile|tablet|ipad/i.test(agent);
        case 'mobile':
          return /mobile/i.test(agent) && !/tablet|ipad/i.test(agent);
        case 'tablet':
          return /tablet|ipad/i.test(agent);
        default:
          return false;
      }
    }).length;
  }

  // Add truncate method to replace the pipe
  truncateText(text: string, limit: number = 25): string {
    if (!text) return 'Direct';
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  }

  getVisitorDuration(connectedAt: Date): string {
    const now = new Date();
    const connected = new Date(connectedAt);
    const diffMs = now.getTime() - connected.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  }

  getTimeSinceLastActivity(lastActivity: Date): string {
    const now = new Date();
    const activity = new Date(lastActivity);
    const diffMs = now.getTime() - activity.getTime();
    const seconds = Math.floor(diffMs / 1000);

    return `${seconds}s ago`;
  }

  getDeviceType(userAgent: string): string {
    if (!userAgent) return 'Unknown';

    if (/mobile/i.test(userAgent)) {
      return '📱 Mobile';
    } else if (/tablet/i.test(userAgent)) {
      return '📟 Tablet';
    } else if (/iPad/i.test(userAgent)) {
      return '📟 Tablet';
    } else {
      return '💻 Desktop';
    }
  }

  getPageName(page: string): string {
    if (page === '/') return 'Homepage';
    if (page.includes('/products')) return 'Products';
    if (page.includes('/about')) return 'About';
    if (page.includes('/contact')) return 'Contact';
    return page;
  }

  refreshData(): void {
    this.isLoading = true;
    this.loadInitialData();
  }

  reconnectSocket(): void {
    this.liveVisitorsService.reconnect();
  }

  ngOnDestroy(): void {
    if (this.visitorsSubscription) {
      this.visitorsSubscription.unsubscribe();
    }
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
}
