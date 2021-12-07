import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanclequeueComponent } from './canclequeue.component';

describe('CanclequeueComponent', () => {
  let component: CanclequeueComponent;
  let fixture: ComponentFixture<CanclequeueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanclequeueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanclequeueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
