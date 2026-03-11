import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  showInfo(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
  }

  showWarning(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['warning-snackbar']
    });
  }

  showWelcome(userName?: string): void {
    const message = userName ? `Welcome back, ${userName}!` : 'Welcome back!';
    this.showSuccess(message, 4000);
  }

  showTicketCreated(ticketId?: string): void {
    const message = ticketId ? `Ticket ${ticketId} created successfully!` : 'Ticket created successfully!';
    this.showSuccess(message);
  }

  showTicketUpdated(ticketId?: string): void {
    const message = ticketId ? `Ticket ${ticketId} updated successfully!` : 'Ticket updated successfully!';
    this.showInfo(message);
  }

  showTicketDeleted(ticketId?: string): void {
    const message = ticketId ? `Ticket ${ticketId} deleted successfully!` : 'Ticket deleted successfully!';
    this.showWarning(message);
  }

  showLoginSuccess(userName?: string): void {
    const message = userName ? `Login successful! Welcome, ${userName}` : 'Login successful!';
    this.showSuccess(message, 4000);
  }

  showLoginError(message: string = 'Login failed. Please check your credentials.'): void {
    this.showError(message);
  }

  showApiError(operation: string): void {
    this.showError(`Failed to ${operation}. Please try again later.`);
  }

  showNetworkError(): void {
    this.showError('Network error. Please check your connection and try again.');
  }
}
