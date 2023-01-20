import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeeAssessmentAddSkillTabularFormComponent} from './employee-assessment-add-skill-tabular-form.component';

describe('EmployeeAssessmentAddSkillTabularFormComponent', () => {
  let component: EmployeeAssessmentAddSkillTabularFormComponent;
  let fixture: ComponentFixture<EmployeeAssessmentAddSkillTabularFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeAssessmentAddSkillTabularFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAssessmentAddSkillTabularFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
