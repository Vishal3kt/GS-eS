// import {
//     ComponentFixture,
//     TestBed,
//     async,
//     fakeAsync,
//     tick,
//   } from '@angular/core/testing';
//   import { HttpClient, HttpHeaders } from '@angular/common/http';
//   import { Router } from '@angular/router';
//   import { LoaderService } from '../services/loader.service';
//   import { ApiService } from '../services/api.service';
// import { RouterTestingModule } from '@angular/router/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Observable } from 'rxjs/internal/Observable';
// import { throwError } from 'rxjs/internal/observable/throwError';
// import { error } from '@angular/compiler/src/util';
// import { NgxSpinnerService } from 'ngx-spinner';
// import Swal from 'sweetalert2';
// import { data } from 'jquery';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { observable, of } from 'rxjs';
// import { EntitlementComponent } from './entitlement.component';

// declare var $:any;
// const loginmock = { value: [{ _parentcustomerid_value: 'MhIcXOriBL' }] };
// describe('EntitlementComponent', () => {
//   let component: EntitlementComponent;
//   let fixture: ComponentFixture<EntitlementComponent>;
//   let apiservice: jasmine.SpyObj<ApiService>;
//   let loaderservice: jasmine.SpyObj<LoaderService>;
//   let spinnerservice: jasmine.SpyObj<NgxSpinnerService>;
//   let mockrouter: jasmine.SpyObj<Router>;
//   const apicallerServiceSpy = jasmine.createSpyObj('ApiService', ['tokengeneration', 'generatepassword', 'getEntitlement','getEntitlementstep2', 'forgotPassword',
//   'mytickets', 'getentitlementname']);
//   const loaderserviceSpy = jasmine.createSpyObj('LoaderService', ['present','close', 'successNotification', 'failNotification'])
  
//   const mockRouter = {
//     navigate: jasmine.createSpyObj('Route', ['navigateByUrl']),
//   };

//   class RouterStub {
//     url = '';
//     navigate(commands: any[], extras?: any) { }
//   }
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//         imports: [
//             HttpClientTestingModule,
//             RouterTestingModule,
//             ReactiveFormsModule,
//             FormsModule,
//             CommonModule,
//           ],
//           schemas: [NO_ERRORS_SCHEMA],
//       declarations: [ EntitlementComponent ],
//       providers: [
//         { provide: ApiService, useValue: apicallerServiceSpy },
//         { provide: LoaderService, useValue: loaderserviceSpy },
//         { provide: Router, useClass: RouterStub },
//       ]
//     })
//     .compileComponents()
//     .then(()=>{
//         apiservice = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
//         loaderservice = TestBed.inject(
//           LoaderService
//         ) as jasmine.SpyObj<LoaderService>;
//         spinnerservice = TestBed.inject(
//           NgxSpinnerService
//         ) as jasmine.SpyObj<NgxSpinnerService>;
//         fixture = TestBed.createComponent(EntitlementComponent);
//         component = fixture.componentInstance;
//         component.userDetails1.email = 'awd@gmail.com';
//         component.userDetails1.token = 'dawd'
//         apiservice.getEntitlement.and.returnValue(of(loginmock));
//         apiservice.getEntitlementstep2.and.returnValue(of(loginmock));
//         fixture.detectChanges();
//     })
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(EntitlementComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });
  
//   // it('check intial form values for login', () => {
//   //   const loginformuserElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('.my-form').querySelectorAll('input')[1];
//   //   const loginformpasswordElement: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('.my-form').querySelectorAll('input')[2];
//   //   loginformuserElement.value = 'mkk.ch@3ktechnologies.com'
//   //   loginformpasswordElement.value = 'MhIcXOriBL';
//   //   // loginformuserElement.dispatchEvent(new Event('input'));
//   //   // loginformpasswordElement.dispatchEvent(new Event('input'));
//   //   const isLoginFormValid = true;
//   //   fixture.whenStable().then(()=>{
//   //     expect(isLoginFormValid).toBeTruthy();
//   //   })
//   // });

//   it('should create', () => {
//     var table = $('#myTable').DataTable();
//     table.destroy();
//     component.userDetails1.email = 'awd@gmail.com';
//     component.userDetails1.token = 'dawd';
//     apiservice.getEntitlement.and.returnValue(of(loginmock));
//         apiservice.getEntitlementstep2.and.returnValue(of(loginmock));
//     component.ngOnInit();
//   });
// });
