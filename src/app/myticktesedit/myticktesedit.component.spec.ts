import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MytickteseditComponent } from './myticktesedit.component';

describe('MytickteseditComponent', () => {
  let component: MytickteseditComponent;
  let fixture: ComponentFixture<MytickteseditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MytickteseditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MytickteseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
