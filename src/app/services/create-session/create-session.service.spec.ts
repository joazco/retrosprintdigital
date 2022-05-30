import { TestBed } from '@angular/core/testing';

import { CreateSessionService } from './create-session.service';

describe('CreateSessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateSessionService = TestBed.get(CreateSessionService);
    expect(service).toBeTruthy();
  });
});
