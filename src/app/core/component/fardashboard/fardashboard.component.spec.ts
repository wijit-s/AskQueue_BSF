import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FardashboardComponent } from './fardashboard.component';

describe('FardashboardComponent', () => {
  let component: FardashboardComponent;
  let fixture: ComponentFixture<FardashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FardashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FardashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
