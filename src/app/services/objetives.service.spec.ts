import { TestBed } from '@angular/core/testing';

import { ObjetivesService } from './objetives.service';

describe('ObjetivesService', () => {
  let service: ObjetivesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjetivesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
