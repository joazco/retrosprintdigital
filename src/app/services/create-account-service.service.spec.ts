import { TestBed } from '@angular/core/testing';

import { CreateAccountServiceService } from './create-account-service.service';

describe('CreateAccountServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateAccountServiceService = TestBed.get(CreateAccountServiceService);
    expect(service).toBeTruthy();
  });
});
