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
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { observable, of } from 'rxjs';

const resToken = {
  access_token:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiJodHRwczovLzNrdHNhbmRib3guY3JtLmR5bmFtaWNzLmNvbS8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84MTg0NjdjZi00NGI5LTQ1YTUtYTQxYS0xZWY5MjRmY2Q3OTUvIiwiaWF0IjoxNjU3Nzg0NTA0LCJuYmYiOjE2NTc3ODQ1MDQsImV4cCI6MTY1Nzc4ODg1OSwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhUQUFBQXBxQ1YzOStMWG9sSGZ5aWdWZ3ZjWHNTUmFOS0QxTVd2aFRPVEprdnlybkU9IiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjliZGZlOWMwLTRjMzItNGJjNS05NDkxLTdlN2JlM2FjN2RhMiIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiQ1JNIiwiZ2l2ZW5fbmFtZSI6IkludGVncmF0aW9uIiwiaXBhZGRyIjoiNDkuMzcuMTMxLjYiLCJuYW1lIjoiSW50ZWdyYXRpb24gQ1JNIiwib2lkIjoiNDFmMzFlNDAtMDhhYi00NWExLWFiZWYtMzkzMjdlODJlNDZlIiwicHVpZCI6IjEwMDMyMDAxRTgzMTU0RUYiLCJyaCI6IjAuQVhFQXoyZUVnYmxFcFVXa0doNzVKUHpYbFFjQUFBQUFBQUFBd0FBQUFBQUFBQUNIQVBZLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6Ilpxbm8ycFgxcmxBMzVGNk8xMUJwRm9BMTd1WWFHVjFHYm5WZDZKbU5FUGciLCJ0aWQiOiI4MTg0NjdjZi00NGI5LTQ1YTUtYTQxYS0xZWY5MjRmY2Q3OTUiLCJ1bmlxdWVfbmFtZSI6IkludGVncmF0aW9uQ1JNQDNrdGVjaG5vbG9naWVzLmNvbSIsInVwbiI6IkludGVncmF0aW9uQ1JNQDNrdGVjaG5vbG9naWVzLmNvbSIsInV0aSI6IkZoNmpTcGlnVkVDd3VDOWNkb21UQUEiLCJ2ZXIiOiIxLjAifQ.k4GXStHpkQEetPJGyZwj-_WMhERrK53BcJSdz8Pt02bhcwtBWJKatdr_P1ggpgGw9iAiyrjuYiYb6-DmOCnP5uScaVUovxzZmzHf6XMkT2zstHTXoAq2GyQuHjxBAyB0xbGvleKfdPxtoq4QtWMNJcXfeYPLi_sp68OfVBpxwURLnEoE_rYyhRZh_tmwn82KixlKEnFlkatv5j9eEAHRJQyJLmlcqEfxIYmNpWqRkQ_5kfhqs_EQ5gGv1rVwxiBC0r-wUtMiqX8JPwMT0yXQppGHwbF9Z5397axwGNZ63ZvoFwnOEs6hmHjwqXAdcSZgDvqw5kF4z-O09dV0WujgQw',
};
const loginmock = { value: [{ new_portalpassword: 'MhIcXOriBL' }] };
const loginmockzero = { value: [] };
const loginmocundefined = undefined;

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
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
      declarations: [LoginComponent],
      providers: [
        { provide: ApiService, useValue: apicallerServiceSpy },
        { provide: LoaderService, useValue: loaderserviceSpy },
        { provide: Router, useClass: RouterStub },
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
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        apiservice.tokengeneration.and.returnValue(of(resToken));
        apiservice.generatepassword.and.returnValue(of(loginmock));
        fixture.detectChanges();
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // component.loginForm = {
    //     email: 'mkk.ch@3ktechnologies.com',
    //      password:'MhIcXOriBL'
    //   }
    component.submitted = false;
  });
  const logininputs = {
    email: '',
    password: '',
  };
  it('cover login function with api caller', () => {
    component.loginForm.value.email = 'mkk.ch@3ktechnologies.com';
    component.loginForm.value.password = 'MhIcXOriBL';
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    component.savedata = 'local';
    apiservice.tokengeneration.and.returnValue(of(resToken));
    apiservice.generatepassword.and.returnValue(of(loginmock));
    component.login();
  });
  it('cover login function with api caller without savedata', () => {
    component.loginForm.value.email = 'mkk.ch@3ktechnologies.com';
    component.loginForm.value.password = 'MhIcXOriBL';
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    component.savedata = '';
    apiservice.tokengeneration.and.returnValue(of(resToken));
    apiservice.generatepassword.and.returnValue(of(loginmock));
    component.login();
  });

  it('cover login function with api caller with different password', () => {
    component.loginForm.value.email = 'mkk.ch@3ktechnologies.com';
    component.loginForm.value.password = 'MhIcXOriBfL';
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    component.savedata = '';
    apiservice.tokengeneration.and.returnValue(of(resToken));
    apiservice.generatepassword.and.returnValue(of(loginmock));
    component.login();
  });

  it('cover login function with api caller with length zero', () => {
    component.loginForm.value.email = 'mkk.ch@3ktechnologies.com';
    component.loginForm.value.password = 'MhIcXOriBL';
    let options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    component.savedata = 'local';
    apiservice.tokengeneration.and.returnValue(of(resToken));
    apiservice.generatepassword.and.returnValue(of(loginmockzero));
    component.login();
  });

  // it('cover login function with api caller with length zero', () => {
    
  // let options = {headers: new HttpHeaders({'Content-Type':  'application/json'})};
  // component.savedata ="local"
  // apiservice.tokengeneration.and.returnValue(of(resToken));
  // apiservice.generatepassword.and.returnValue(of(Observable<undefined>))
  // component.login()
  // });

  

  it('On Submit false', () => {
    component.submitted = true;
    component.onSubmit();
  });

  it('On Submit true', () => {
    component.submitted = true;
    component.loginForm.value.email = 'mkk.ch@3ktechnologies.com';
    component.loginForm.value.password = 'MhIcXOriBL';
    component.onSubmit();
  });

  it('should update header', fakeAsync(() => {
    spyOn(component, 'tempData').and.callThrough();
  }));

  it('checkValue', ()=> {
    const ev = {
      target: { checked : true}
    }
    component.checkValue(ev);
  })

  it('checkValue', ()=> {
    const ev = {
      target: { checked : false}
    }
    component.checkValue(ev);
  })
  // it('check intial form values for login', () => {
  //   const loginformuserElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('.my-form').querySelectorAll('input')[1];
  //   const loginformpasswordElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('.my-form').querySelectorAll('input')[2];
  //   loginformuserElement.value = 'mkk.ch@3ktechnologies.com'
  //   loginformpasswordElement.value = 'MhIcXOriBL';
  //   // loginformuserElement.dispatchEvent(new Event('input'));
  //   // loginformpasswordElement.dispatchEvent(new Event('input'));
  //   const isLoginFormValid = true;
  //   fixture.whenStable().then(()=>{
  //     expect(isLoginFormValid).toBeTruthy();
  //   })
  // });
});
