import {
    ComponentFixture,
    TestBed,
    async,
    fakeAsync,
    tick,
  } from '@angular/core/testing';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Router } from '@angular/router';
  import { LoaderService } from '../services/loader.service';
  import { ApiService } from '../services/api.service';
  import { RouterTestingModule } from '@angular/router/testing';
  import { HttpClientTestingModule } from '@angular/common/http/testing';
  import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';
  import { Observable } from 'rxjs';
  import { throwError } from 'rxjs';
  import { NgxSpinnerService } from 'ngx-spinner';
  import Swal from 'sweetalert2';
  import { NO_ERRORS_SCHEMA } from '@angular/core';
  import { observable, of } from 'rxjs';
  
  const resToken = {
    access_token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJodHRwczovLzNrdHNhbmRib3guY3JtLmR5bmFtaWNzLmNvbS8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84MTg0NjdjZi00NGI5LTQ1YTUtYTQxYS0xZWY5MjRmY2Q3OTUvIiwiaWF0IjoxNjU3Nzg0NTA0LCJuYmYiOjE2NTc3ODQ1MDQsImV4cCI6MTY1Nzc4ODg1OSwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhUQUFBQXBxQ1YzOStMWG9sSGZ5aWdWZ3ZjWHNTUmFOS0QxTVd2aFRPVEprdnlybkU9IiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjliZGZlOWMwLTRjMzItNGJjNS05NDkxLTdlN2JlM2FjN2RhMiIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiQ1JNIiwiZ2l2ZW5fbmFtZSI6IkludGVncmF0aW9uIiwiaXBhZGRyIjoiNDkuMzcuMTMxLjYiLCJuYW1lIjoiSW50ZWdyYXRpb24gQ1JNIiwib2lkIjoiNDFmMzFlNDAtMDhhYi00NWExLWFiZWYtMzkzMjdlODJlNDZlIiwicHVpZCI6IjEwMDMyMDAxRTgzMTU0RUYiLCJyaCI6IjAuQVhFQXoyZUVnYmxFcFVXa0doNzVKUHpYbFFjQUFBQUFBQUFBd0FBQUFBQUFBQUNIQVBZLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6Ilpxbm8ycFgxcmxBMzVGNk8xMUJwRm9BMTd1WWFHVjFHYm5WZDZKbU5FUGciLCJ0aWQiOiI4MTg0NjdjZi00NGI5LTQ1YTUtYTQxYS0xZWY5MjRmY2Q3OTUiLCJ1bmlxdWVfbmFtZSI6IkludGVncmF0aW9uQ1JNQDNrdGVjaG5vbG9naWVzLmNvbSIsInVwbiI6IkludGVncmF0aW9uQ1JNQDNrdGVjaG5vbG9naWVzLmNvbSIsInV0aSI6IkZoNmpTcGlnVkVDd3VDOWNkb21UQUEiLCJ2ZXIiOiIxLjAifQ.k4GXStHpkQEetPJGyZwj-_WMhERrK53BcJSdz8Pt02bhcwtBWJKatdr_P1ggpgGw9iAiyrjuYiYb6-DmOCnP5uScaVUovxzZmzHf6XMkT2zstHTXoAq2GyQuHjxBAyB0xbGvleKfdPxtoq4QtWMNJcXfeYPLi_sp68OfVBpxwURLnEoE_rYyhRZh_tmwn82KixlKEnFlkatv5j9eEAHRJQyJLmlcqEfxIYmNpWqRkQ_5kfhqs_EQ5gGv1rVwxiBC0r-wUtMiqX8JPwMT0yXQppGHwbF9Z5397axwGNZ63ZvoFwnOEs6hmHjwqXAdcSZgDvqw5kF4z-O09dV0WujgQw',
  };
  const loginmock = { value: [{ new_portalpassword: 'MhIcXOriBL' }] };
  const loginmockzero = { value: [] };

import { ForgotComponent } from './forgot.component';

describe('ForgotComponent', () => {
    let component: ForgotComponent;
    let fixture: ComponentFixture<ForgotComponent>;
    let apiservice: jasmine.SpyObj<ApiService>;
    let loaderservice: jasmine.SpyObj<LoaderService>;
    let spinnerservice: jasmine.SpyObj<NgxSpinnerService>;
    let mockrouter: jasmine.SpyObj<Router>;
  
    beforeEach(async () => {
      const apicallerServiceSpy = jasmine.createSpyObj('ApiService', [
        'tokengeneration',
        'generatepassword',
        'getEntitlement',
        'getEntitlementstep2',
        'forgotPassword',
        'mytickets',
        'getentitlementname',
      ]);
      const loaderserviceSpy = jasmine.createSpyObj('LoaderService', [
        'present',
        'close',
        'successNotification',
        'failNotification',
      ]);
  
      const mockRouter = {
        navigate: jasmine.createSpyObj('Route', ['navigateByUrl']),
      };
  
      class RouterStub {
        url = '';
        navigate(commands: any[], extras?: any) {}
      }
      await TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          RouterTestingModule,
          ReactiveFormsModule,
          FormsModule,
          CommonModule,
        ],
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [ForgotComponent],
        providers: [
          { provide: ApiService, useValue: apicallerServiceSpy },
          { provide: LoaderService, useValue: loaderserviceSpy },
         
        ],
      })
        .compileComponents()
        .then(() => {
          apiservice = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
          loaderservice = TestBed.inject(
            LoaderService
          ) as jasmine.SpyObj<LoaderService>;
          spinnerservice = TestBed.inject(
            NgxSpinnerService
          ) as jasmine.SpyObj<NgxSpinnerService>;
          fixture = TestBed.createComponent(ForgotComponent);
          component = fixture.componentInstance;
          component.enteremail.value.email = 'mkk.ch@3ktechnologies.com';
          apiservice.tokengeneration.and.returnValue(of(resToken));
          apiservice.forgotPassword.and.returnValue(of(loginmock));
          fixture.detectChanges();
        });
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.submitted = false;
  });

  it('cover verifyemail function with api caller', () => {
    component.enteremail.value.email = 'mkk.ch@3ktechnologies.com';
    const email = 'mkk.ch@3ktechnologies.com';
    apiservice.tokengeneration.and.returnValue(of(resToken));
    apiservice.forgotPassword.and.returnValue(of(loginmock));
    component.verifyemail(email);
  });

  it('cover verifyemail function with api caller', () => {
    component.enteremail.value.email = 'mkk.ch@3ktechnologies.com';
    const email = 'mkk.ch@3ktechnologies.com';
    apiservice.tokengeneration.and.returnValue(of(resToken));
    apiservice.forgotPassword.and.returnValue(of(loginmockzero));
    component.verifyemail(email);
  });

  it('On Submit true', () => {
    component.submitted = true;
    component.enteremail.value.email = 'mkk.ch@3ktechnologies.com';
    component.submitemail();
  });

  it('should update header', fakeAsync(() => {
    spyOn(component, 'f').and.callThrough();
  }));

  it('final val',() => {
    component.finalVal()
  });

//   it('should update header', fakeAsync(() => {
//     spyOn(component, 'contactFormGroup').and.callThrough();
//   }));
});
