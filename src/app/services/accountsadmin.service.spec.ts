import { TestBed } from '@angular/core/testing';

import { AccountsadminService } from './accountsadmin.service';

describe('AccountsadminService', () => {
  let service: AccountsadminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsadminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
