// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { Router, NavigationEnd } from '@angular/router';
// import { LoadingModulesComponent } from './loading-modules.component';
// import { observable, of } from 'rxjs';
// import { CommonModule } from '@angular/common';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// describe('LoadingModulesComponent', () => {
//   let component: LoadingModulesComponent;
//   let fixture: ComponentFixture<LoadingModulesComponent>;

//   beforeEach(async () => {
//     class RouterStub {
//         url = '';
//         navigate(commands: any[], extras?: any) {}
//       }
//     await TestBed.configureTestingModule({
//       declarations: [ LoadingModulesComponent ]
//     })
//     .compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(LoadingModulesComponent);
//     component = fixture.componentInstance;
//     component.navItem=[
//         {name:'Dashboard',img:"home1.png",img1:"home.png",selected:'true',icon:'fa fa-home',path:'/LoadingComponent/Dashboard'},
//         {name:'My Entitlement',img:"Entitlement.png",selected:'true',img1:"Entitlement1.png",icon:'fa fa-file-text',path:'/LoadingComponent/MyEntitlement'},
//         {name:'My Ticket',img:"ticket.png",img1:"ticket1.png",selected:'true',icon:'fa fa-check',path:'/LoadingComponent/Myticket'},
//         {name:'Reports',img:"Report.png",img1:"Report1.png",selected:'true',icon:'fa fa-line-chart',path:'/LoadingComponent/Reports'}
//       ];
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     component.changepassword();
//   });

//   it('should create', () => {
//     component.logout();
//   });
// });
