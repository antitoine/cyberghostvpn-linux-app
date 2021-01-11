import { TestBed } from '@angular/core/testing';

import { CyberGhostService } from './cyber-ghost.service';

describe('CyberGhostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CyberGhostService = TestBed.get(CyberGhostService);
    expect(service).toBeTruthy();
  });
});
