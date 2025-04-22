import { TestBed } from '@angular/core/testing';

import { BuycoinsService } from './buycoins.service';

describe('BuycoinsService', () => {
  let service: BuycoinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuycoinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
