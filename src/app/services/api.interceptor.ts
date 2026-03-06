import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from './loader.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  private activeRequests = 0;

  constructor(
    private router: Router,
    private loaderService: LoaderService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // DISABLED: Using new LoadingService instead
    // Show loader for first request
    // if (this.activeRequests === 0) {
    //   this.loaderService.present();
    // }
    this.activeRequests++;

    // Clone the request and add headers
    let authReq = req;
    
    // Add authorization header if token exists and not a token generation request
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    console.log('Interceptor - Token found:', !!token);
    console.log('Interceptor - Request URL:', req.url);
    
    // Don't add any headers to Power Automate workflows - let them pass through untouched
    const isPowerAutomateRequest = req.url.includes('powerautomate') || 
                                req.url.includes('logic.azure.com') || 
                                req.url.includes('prod-150.westus.logic.azure.com') ||
                                req.url.includes('workflows/12d81a7811874fcb80fab27eceaf92aa');
    
    if (isPowerAutomateRequest) {
      // Power Automate requests should pass through without any modifications
      console.log('Interceptor - Power Automate request detected, passing through unchanged');
      return next.handle(req);
    }
    
    if (token && !req.headers.has('Authorization') && !isPowerAutomateRequest) {
      authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('Interceptor - Added Dynamics Authorization header:', `Bearer ${token.substring(0, 20)}...`);
    } else if (isPowerAutomateRequest) {
      // Add Power Automate specific authentication if needed
      // Power Automate workflows might need different auth or no auth
      console.log('Interceptor - Power Automate request detected, skipping Dynamics auth');
    }

    // Add content-type header for POST/PUT requests if not present
    if ((req.method === 'POST' || req.method === 'PUT') && !req.headers.has('Content-Type')) {
      authReq = authReq.clone({
        headers: authReq.headers.set('Content-Type', 'application/json')
      });
    }

    return next.handle(authReq).pipe(
      finalize(() => {
        // DISABLED: Using new LoadingService instead
        // Hide loader when all requests complete
        this.activeRequests--;
        // if (this.activeRequests === 0) {
        //   this.loaderService.close();
        // }
      }),
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401 && !environment.enableMockLogin) {
        errorMessage = `Your session has expired. Please login to continue.`;
        // DISABLED: Using new LoadingService instead
        // this.loaderService.close();
        this.clearSessionAndRedirect();
      } else if (error.status === 502) {
        errorMessage = `Please Check your data. Record not updated.`;
      } else if (error.status === 0) {
        errorMessage = `Network error. Please check your connection.`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        // DISABLED: Using new LoadingService instead
        // this.loaderService.close();
      }
    }

    this.loaderService.failNotification(errorMessage);
    return throwError(() => error);
  }

  private clearSessionAndRedirect(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/Login']);
  }
}
