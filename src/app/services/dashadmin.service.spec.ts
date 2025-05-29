import { TestBed } from '@angular/core/testing';

import { DashadminService } from './dashadmin.service';

describe('DashadminService', () => {
  let service: DashadminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashadminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
