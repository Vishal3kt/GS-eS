import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let spinnerservice: jasmine.SpyObj<NgxSpinnerService>;
  let mockrouter: jasmine.SpyObj<Router>;
  beforeEach(async () => {
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
      declarations: [ DashboardComponent ],
      providers: [
        { provide: Router, useClass: RouterStub },
      ],
    })
    .compileComponents()
    .then(()=>{
        spinnerservice = TestBed.inject(
            NgxSpinnerService
          ) as jasmine.SpyObj<NgxSpinnerService>;
          fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
    })
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  

  // it('should create', () => {
  //   let name ="My Entitlement"
  //   component.changepage(name);
  // });
  // it('should create', () => {
  //   let name ="My Ticket"
  //   component.changepage(name);
  // });
  // it('should create', () => {
  //   let name =""
  //   component.changepage(name);
  // });
});
