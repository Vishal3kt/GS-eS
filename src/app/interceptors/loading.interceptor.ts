import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip loader for certain requests if needed
    if (this.shouldSkipLoader(request)) {
      return next.handle(request);
    }

    this.activeRequests++;
    this.showLoader();

    return next.handle(request).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            this.activeRequests--;
            if (this.activeRequests === 0) {
              this.hideLoader();
            }
          }
        },
        (error) => {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.hideLoader();
          }
          throw error;
        }
      )
    );
  }

  private shouldSkipLoader(request: HttpRequest<any>): boolean {
    // Skip loader for requests to these endpoints
    const skipUrls = [
      '/assets/',
      '/api/health-check',
      '/api/ping'
    ];
    
    return skipUrls.some(url => request.url.includes(url));
  }

  private showLoader(): void {
    this.loadingService.show();
  }

  private hideLoader(): void {
    this.loadingService.hide();
  }
}
