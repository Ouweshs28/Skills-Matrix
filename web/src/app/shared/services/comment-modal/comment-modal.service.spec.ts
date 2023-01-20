import {TestBed} from '@angular/core/testing';

import {CommentModalService} from './comment-modal.service';

describe('CommentModalService', () => {
  let service: CommentModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
