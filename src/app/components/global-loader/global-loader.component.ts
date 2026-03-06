import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './global-loader.component.html',
  styleUrls: ['./global-loader.component.scss']
})
export class GlobalLoaderComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loadingSubscription: Subscription | undefined;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingSubscription = this.loadingService.loading$
      .subscribe(loading => {
        this.isLoading = loading;
      });
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
