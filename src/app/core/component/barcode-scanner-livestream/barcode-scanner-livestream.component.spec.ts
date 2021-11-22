import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeScannerLivestreamComponent } from './barcode-scanner-livestream.component';

describe('BarcodeScannerLivestreamComponent', () => {
  let component: BarcodeScannerLivestreamComponent;
  let fixture: ComponentFixture<BarcodeScannerLivestreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeScannerLivestreamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeScannerLivestreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
