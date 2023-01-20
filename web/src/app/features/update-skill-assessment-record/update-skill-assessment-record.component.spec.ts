import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateSkillAssessmentRecordComponent} from './update-skill-assessment-record.component';

describe('EmployeeAssessmentUpdateSkillComponent', () => {
  let component: UpdateSkillAssessmentRecordComponent;
  let fixture: ComponentFixture<UpdateSkillAssessmentRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateSkillAssessmentRecordComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSkillAssessmentRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
