import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeeAssesmentAddSkillComponent} from './employee-assesment-add-skill.component';

describe('EmployeeAssesmentAddSkillComponent', () => {
  let component: EmployeeAssesmentAddSkillComponent;
  let fixture: ComponentFixture<EmployeeAssesmentAddSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeAssesmentAddSkillComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAssesmentAddSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
