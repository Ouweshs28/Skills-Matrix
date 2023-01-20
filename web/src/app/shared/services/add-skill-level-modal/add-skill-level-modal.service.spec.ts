import {TestBed} from '@angular/core/testing';

import {AddSkillLevelModalService} from './add-skill-level-modal.service';

describe('AddSkillLevelModalService', () => {
  let service: AddSkillLevelModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddSkillLevelModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
