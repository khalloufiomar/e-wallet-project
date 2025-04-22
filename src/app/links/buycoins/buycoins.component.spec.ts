import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCoinsComponent } from './buycoins.component';

describe('BuycoinsComponent', () => {
  let component: BuyCoinsComponent;
  let fixture: ComponentFixture<BuyCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyCoinsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
