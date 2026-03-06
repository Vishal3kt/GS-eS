import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        HomeComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct component structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home-header')).toBeTruthy();
    expect(compiled.querySelector('.home-main')).toBeTruthy();
    expect(compiled.querySelector('.home-footer')).toBeTruthy();
  });

  it('should have carousel with correct structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const carousel = compiled.querySelector('#mainCarousel');
    expect(carousel).toBeTruthy();
    
    const indicators = carousel?.querySelectorAll('.carousel-indicators button');
    expect(indicators?.length).toBe(3);
    
    const slides = carousel?.querySelectorAll('.carousel-item');
    expect(slides?.length).toBe(3);
  });

  it('should have login button in header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loginButton = compiled.querySelector('.home-header .btn-primary');
    expect(loginButton).toBeTruthy();
    expect(loginButton?.textContent?.trim()).toContain('Login');
  });

  it('should navigate to login when goToLogin is called', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    component.goToLogin();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should have correct layout structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const hostElement = compiled.querySelector(':host');
    expect(hostElement?.classList.contains('ng-star-inserted')).toBeTruthy();
  });

  it('should have footer with copyright text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footer = compiled.querySelector('.home-footer');
    expect(footer).toBeTruthy();
    expect(footer?.textContent).toContain('3K Technologies');
  });
});
