import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatTableModule, MatPaginatorModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  // Ticket status data with professional light colors
  ticketStats = [
    { name: 'OPEN', count: 0, targetCount: 24, color: '#64B5F6', icon: 'inbox' },
    { name: 'CANCEL', count: 0, targetCount: 8, color: '#FF8A65', icon: 'cancel' },
    { name: 'ON HOLD', count: 0, targetCount: 5, color: '#A5D6A7', icon: 'pause_circle' },
    { name: 'RESOLVED', count: 0, targetCount: 18, color: '#81C784', icon: 'check_circle' }
  ];

  // Recent activity data
  recentActivities = [
    { id: 'CAS-00123', title: 'Login Issue with Portal', status: 'Open', priority: 'High', created: '2025-03-05', customer: 'John Doe' },
    { id: 'CAS-00122', title: 'Password Reset Request', status: 'In Progress', priority: 'Medium', created: '2025-03-05', customer: 'Jane Smith' },
    { id: 'CAS-00121', title: 'System Performance Issue', status: 'Open', priority: 'High', created: '2025-03-04', customer: 'Bob Johnson' },
    // { id: 'CAS-00120', title: 'Feature Request - Dashboard', status: 'Pending', priority: 'Low', created: '2025-03-04', customer: 'Alice Brown' },
    // { id: 'CAS-00119', title: 'Data Export Problem', status: 'Resolved', priority: 'Medium', created: '2025-03-03', customer: 'Charlie Wilson' }
  ];

  // Table columns for recent activity
  displayedColumns: string[] = ['id', 'title', 'status', 'priority', 'created', 'customer'];

  constructor(public route: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.animateCounters();
  }

  animateCounters(): void {
    this.ticketStats.forEach((item, index) => {
      setTimeout(() => {
        this.animateCounter(item);
      }, index * 100); // Faster stagger animation
    });
  }

  animateCounter(item: any): void {
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

  getStatusColor(status: string): string {
    switch(status.toLowerCase()) {
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
    switch(priority.toLowerCase()) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  }

  hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '108, 117, 125'; // Default gray
  }
}
