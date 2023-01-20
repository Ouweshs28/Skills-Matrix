import {TestBed} from '@angular/core/testing';

import {TargetModalService} from './target-modal.service';

describe('TargetModalService', () => {
  let service: TargetModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TargetModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
