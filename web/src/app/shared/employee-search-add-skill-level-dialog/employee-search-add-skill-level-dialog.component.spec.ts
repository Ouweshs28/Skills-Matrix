import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeeSearchAddSkillLevelDialogComponent} from './employee-search-add-skill-level-dialog.component';

describe('EmployeeSearchAddSkillLevelDialogComponent', () => {
  let component: EmployeeSearchAddSkillLevelDialogComponent;
  let fixture: ComponentFixture<EmployeeSearchAddSkillLevelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeSearchAddSkillLevelDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSearchAddSkillLevelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
