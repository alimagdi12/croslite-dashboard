import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';

export interface LiveVisitor {
  socketId: string;
  page: string;
  referrer: string;
  userAgent: string;
  screen: string;
  language: string;
  connectedAt: Date;
  lastActivity: Date;
  ip?: string;
}

export interface LiveVisitorsData {
  count: number;
  visitors: LiveVisitor[];
}

@Injectable({
  providedIn: 'root'
})
export class LiveVisitorsService {
  private socket: Socket | null = null;
  private isConnected = false;
  private apiUrl = 'https://api.croslite.com.eg:3001/api/analytics';

  // BehaviorSubjects for reactive updates
  private liveVisitorsSubject = new BehaviorSubject<LiveVisitorsData>({ count: 0, visitors: [] });
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  // Observables for components to subscribe to
  public liveVisitors$ = this.liveVisitorsSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      // Use the correct port for your environment
      const socketUrl = 'https://api.croslite.com.eg:3002';

      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        withCredentials: true
      });

      // Connection events
      this.socket.on('connect', () => {
        this.isConnected = true;
        this.connectionStatusSubject.next(true);
        console.log('Dashboard connected to live updates');

        // Request initial state
        this.socket?.emit('request-initial-state');
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        this.connectionStatusSubject.next(false);
        console.log('Dashboard disconnected from live updates');
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('Connection error:', error);
        this.isConnected = false;
        this.connectionStatusSubject.next(false);
      });

      // Live visitors data events
      this.socket.on('live-visitors-initial', (data: LiveVisitorsData) => {
        console.log('Received initial state:', data);
        this.liveVisitorsSubject.next(data);
      });

      this.socket.on('live-visitors-update', (data: LiveVisitorsData) => {
        console.log('Live visitors update:', data);
        this.liveVisitorsSubject.next(data);
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }

  // Get current state
  getCurrentVisitors(): LiveVisitorsData {
    return this.liveVisitorsSubject.value;
  }

  getCurrentConnectionStatus(): boolean {
    return this.connectionStatusSubject.value;
  }

  // HTTP fallback methods
  getLiveVisitorsHttp() {
    return this.http.get<{ success: boolean; data: LiveVisitorsData }>(
      `${this.apiUrl}/live-visitors`
    );
  }

  getLiveVisitorsCountHttp() {
    return this.http.get<{ success: boolean; data: { count: number } }>(
      `${this.apiUrl}/live-visitors/count`
    );
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      this.connectionStatusSubject.next(false);
    }
  }

  reconnect() {
    if (this.socket) {
      this.socket.connect();
    } else {
      this.initializeSocket();
    }
  }
}
