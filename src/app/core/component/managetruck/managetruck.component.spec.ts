import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagetruckComponent } from './managetruck.component';

describe('ManagetruckComponent', () => {
  let component: ManagetruckComponent;
  let fixture: ComponentFixture<ManagetruckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagetruckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagetruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
