import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../services/api.service';
import { LoadingService } from '../services/loading.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatTableModule, MatPaginatorModule, MatTooltipModule, MatSnackBarModule],
  providers: [MatSnackBar, NotificationService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  // Ticket status data with professional light colors
  ticketStats = [
    { name: 'OPEN', count: 0, targetCount: 0, color: '#64B5F6', icon: 'inbox' },
    { name: 'CANCEL', count: 0, targetCount: 0, color: '#FF8A65', icon: 'cancel' },
    { name: 'ON HOLD', count: 0, targetCount: 0, color: '#A5D6A7', icon: 'pause_circle' },
    { name: 'RESOLVED', count: 0, targetCount: 0, color: '#81C784', icon: 'check_circle' }
  ];

  // Recent activity data
  recentActivities: any[] = [];

  // Table columns for recent activity
  displayedColumns: string[] = ['id', 'title', 'status', 'priority', 'customer'];

  // Loading states
  isLoadingCounts = true;
  isLoadingActivity = true;

  constructor(
    public route: Router,
    private apiService: ApiService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.showWelcomeMessageOnce();
  }

  loadDashboardData(): void {
    // Get user email from multiple sources
    let userEmail = sessionStorage.getItem('email') || localStorage.getItem('email');

    // If still not found, try to get it from loginDetails
    if (!userEmail) {
      const loginDetails = sessionStorage.getItem('loginDetails') || localStorage.getItem('loginDetails');
      if (loginDetails) {
        try {
          const parsedData = JSON.parse(loginDetails);
          userEmail = parsedData.email || parsedData.Data?.[0]?.emailaddress1;
          console.log('Dashboard - Retrieved from loginDetails:', parsedData);
        } catch (e) {
          console.error('Error parsing login details:', e);
        }
      }
    }

    console.log('Dashboard - Retrieved user email:', userEmail);

    if (!userEmail) {
      console.error('No user email found in storage');
      this.isLoadingCounts = false;
      this.isLoadingActivity = false;
      return;
    }

    // Load dashboard counts
    this.loadDashboardCounts(userEmail);

    // Load recent activity
    this.loadRecentActivity(userEmail);
  }

  loadDashboardCounts(email: string): void {
    this.apiService.getDashboardCounts(email).subscribe({
      next: (response: any) => {
        console.log('Dashboard counts response:', response);
        this.mapDashboardCounts(response);
        this.isLoadingCounts = false;
        // Trigger animation after data is loaded
        setTimeout(() => this.animateCounters(), 100);
      },
      error: (error) => {
        console.error('Error loading dashboard counts:', error);
        this.isLoadingCounts = false;
        // Set default values on error
        this.setDefaultCounts();
        // Still animate with default values
        setTimeout(() => this.animateCounters(), 100);
        this.showErrorMessage('Failed to load dashboard counts');
      }
    });
  }

  loadRecentActivity(email: string): void {
    this.apiService.getRecentActivity(email).subscribe({
      next: (response: any) => {
        console.log('Recent activity response:', response);
        this.mapRecentActivity(response);
        this.isLoadingActivity = false;
      },
      error: (error) => {
        console.error('Error loading recent activity:', error);
        this.isLoadingActivity = false;
        // Set empty array on error
        this.recentActivities = [];
        this.showErrorMessage('Failed to load recent activity');
      }
    });
  }

  mapDashboardCounts(response: any): void {
    console.log('Raw dashboard counts response:', response);

    // Map API response to ticket stats
    // API returns lowercase keys: open, resolved, cancel, hold
    if (response && response.open !== undefined) {
      this.ticketStats[0].targetCount = parseInt(response.open) || 0; // OPEN
    }
    if (response && response.cancel !== undefined) {
      this.ticketStats[1].targetCount = parseInt(response.cancel) || 0; // CANCEL
    }
    if (response && response.hold !== undefined) {
      this.ticketStats[2].targetCount = parseInt(response.hold) || 0; // ON HOLD
    }
    if (response && response.resolved !== undefined) {
      this.ticketStats[3].targetCount = parseInt(response.resolved) || 0; // RESOLVED
    }

    console.log('Mapped ticket stats:', this.ticketStats);
  }

  mapRecentActivity(response: any): void {
    console.log('Raw recent activity response:', response);

    // Initialize with empty array
    this.recentActivities = [];

    // Map API response to recent activities
    // Handle different response formats
    let activitiesArray: any[] = [];

    if (response && Array.isArray(response)) {
      activitiesArray = response;
    } else if (response && response.value && Array.isArray(response.value)) {
      activitiesArray = response.value;
    } else if (response && response.Data && Array.isArray(response.Data)) {
      activitiesArray = response.Data;
    }

    // Map activities and limit to latest 3
    if (activitiesArray.length > 0) {
      this.recentActivities = activitiesArray
        .slice(0, 3) // Take only latest 3 records
        .map((item: any) => ({
          id: item.ID || item.id || item.ticketnumber || 'N/A',
          title: item.Title || item.title || item.title || 'N/A',
          status: this.getStatusText(item.Status || item.status || item.statuscode),
          priority: this.getPriorityText(item.Priority || item.priority || item.prioritycode),
          customer: item.Customer || item.customer || item._customerid_value || 'N/A',
          // Store full values for tooltips
          fullId: item.ID || item.id || item.ticketnumber || 'N/A',
          fullTitle: item.Title || item.title || item.title || 'N/A',
          fullCustomer: item.Customer || item.customer || item._customerid_value || 'N/A'
        }));
    }

    console.log('Mapped recent activities (limited to 3):', this.recentActivities);
  }

  setDefaultCounts(): void {
    // Set default values when API fails
    this.ticketStats[0].targetCount = 0; // OPEN
    this.ticketStats[1].targetCount = 0; // CANCEL
    this.ticketStats[2].targetCount = 0; // ON HOLD
    this.ticketStats[3].targetCount = 0; // RESOLVED
  }

  ngAfterViewInit(): void {
    // Don't animate counters immediately - wait for data to load
    // Animation will be triggered in loadDashboardCounts after data arrives
  }

  animateCounters(): void {
    this.ticketStats.forEach((item, index) => {
      setTimeout(() => {
        this.animateCounter(item);
      }, index * 100); // Faster stagger animation
    });
  }

  animateCounter(item: any): void {
    // Find the specific stat element for this item
    const statElements = document.querySelectorAll('.stat-number');
    const index = this.ticketStats.indexOf(item);
    if (statElements[index]) {
      statElements[index].classList.add('animated');
    }

    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = item.targetCount / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      current += increment;
      step++;

      if (step >= steps) {
        item.count = item.targetCount;
        clearInterval(timer);
      } else {
        item.count = Math.floor(current);
      }
    }, duration / steps);
  }

  createNewTicket(): void {
    this.route.navigate(["/LoadingComponent/Myticket"]);
  }

  viewAllTickets(): void {
    this.route.navigate(["/LoadingComponent/Myticket"]);
  }

  viewTicketsByStatus(stat: any): void {
    const name = (stat?.name || '').toString().trim().toLowerCase();
    let statusParam: string | null = null;

    if (name === 'open') {
      statusParam = 'open';
    } else if (name === 'cancel') {
      statusParam = 'cancel';
    } else if (name === 'on hold') {
      statusParam = 'hold';
    } else if (name === 'resolved') {
      statusParam = 'resolved';
    }

    this.route.navigate(["/LoadingComponent/Myticket"], {
      queryParams: statusParam ? { status: statusParam } : undefined
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'open': return '#2196f3';
      case 'cancel': return '#f44336';
      case 'on hold': return '#ff9800';
      case 'resolved': return '#4caf50';
      case 'in progress': return '#ff9800';
      case 'pending': return '#9c27b0';
      default: return '#666';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      case 'critical': return '#9c27b0';
      default: return '#757575';
    }
  }

  // Helper function to map status codes to text
  getStatusText(statusCode: any): string {
    if (statusCode === null || statusCode === undefined) {
      return 'Unknown';
    }

    if (typeof statusCode === 'string') {
      const trimmed = statusCode.trim();
      if (trimmed === '') {
        return 'Unknown';
      }

      const numeric = Number(trimmed);
      if (!Number.isNaN(numeric)) {
        statusCode = numeric;
      } else {
        return trimmed; // Already text
      }
    }

    const code = Number(statusCode);
    switch (code) {
      case 0: return "Open";
      case 1: return "In Progress";
      case 2: return "On Hold by 3KT";
      case 3: return "Cust Info Required";
      case 4: return "Analysis";
      case 5: return "Problem Solved";
      case 6: return "Cancelled";
      case 968590004: return "Customer Info";
      case 968590005: return "Customer Reply";
      case 968590006: return "Budget Approval";
      case 968590007: return "Budget Approved";
      case 968590008: return "Customer Testing";
      case 968590009: return "Deploy";
      case 968590010: return "On Hold by Customer";
      case 968590011: return "Request for cancelation";
      case 100000000: return "On Hold";
      case 100000001: return "UAT";
      case 100000002: return "Production";
      case 100000003: return "Completed";
      case 100000004: return "Open";
      case 100000005: return "Assigned";
      case 1000: return "Information Provided";
      case 2000: return "Merged";
      default: return "Unknown";
    }
  }

  // Helper function to map priority codes to text
  getPriorityText(priorityCode: any): string {
    if (priorityCode === null || priorityCode === undefined) {
      return 'Medium';
    }

    if (typeof priorityCode === 'string') {
      const trimmed = priorityCode.trim();
      if (trimmed === '') {
        return 'Medium';
      }

      const numeric = Number(trimmed);
      if (!Number.isNaN(numeric)) {
        priorityCode = numeric;
      } else {
        return trimmed; // Already text
      }
    }

    const code = Number(priorityCode);
    switch (code) {
      case 1: return "High";
      case 2: return "Medium";
      case 3: return "Low";
      case 4: return "Critical";
      default: return "Medium";
    }
  }

  // Helper function to map case type codes to text
  getCaseTypeText(caseTypeCode: any): string {
    if (typeof caseTypeCode === 'string') {
      return caseTypeCode; // Already text
    }

    const code = Number(caseTypeCode);
    switch (code) {
      case 1: return "Question";
      case 2: return "Problem";
      case 3: return "Feature Request";
      default: return "General";
    }
  }

  hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '108, 117, 125'; // Default gray
  }

  // Helper functions for text truncation
  truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  truncateId(id: string): string {
    return this.truncateText(id, 10); // Show first 8 characters
  }

  truncateCustomer(customer: string): string {
    return this.truncateText(customer, 14); // Show first 10 characters
  }

  truncateTitle(title: string): string {
    return this.truncateText(title, 60); // Show first 60 characters
  }

  // Notification methods
  showWelcomeMessageOnce(): void {
    // Check if this is the first time loading dashboard after login
    const hasShownWelcome = sessionStorage.getItem('welcomeShown');

    if (!hasShownWelcome) {
      const loginDetails = sessionStorage.getItem('loginDetails') || localStorage.getItem('loginDetails');
      if (loginDetails) {
        try {
          const userData = JSON.parse(loginDetails);
          const userName = userData.email || userData.Data?.[0]?.emailaddress1 || 'User';
          this.notificationService.showWelcome(userName);
          // Mark that welcome message has been shown
          sessionStorage.setItem('welcomeShown', 'true');
        } catch (e) {
          console.error('Error parsing login details for welcome message:', e);
          this.notificationService.showWelcome();
          sessionStorage.setItem('welcomeShown', 'true');
        }
      }
    }
  }

  showSuccessMessage(message: string): void {
    this.notificationService.showSuccess(message);
  }

  showErrorMessage(message: string): void {
    this.notificationService.showError(message);
  }

  showInfoMessage(message: string): void {
    this.notificationService.showInfo(message);
  }
}
