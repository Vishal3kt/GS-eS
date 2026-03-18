import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, HttpClientModule],
  providers: [ApiService, LoaderService, NotificationService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileData: any = {};
  isLoading = false;
  
  constructor(
    private apiService: ApiService,
    private loaderService: LoaderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.loaderService.present();
    
    this.apiService.getProfile().subscribe({
      next: (response: any) => {
        if (response && response.value && response.value.length > 0) {
          this.profileData = response.value[0];
        } else {
          this.notificationService.showError('Profile data not found');
        }
        this.isLoading = false;
        this.loaderService.close();
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
        this.notificationService.showError('Failed to load profile');
        this.isLoading = false;
        this.loaderService.close();
      }
    });
  }
}
