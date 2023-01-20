import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManagerEmployeeAssessmentsComponent} from './manager-employee-assessments.component';

describe('ManagerEmployeeAssessmentsComponent', () => {
  let component: ManagerEmployeeAssessmentsComponent;
  let fixture: ComponentFixture<ManagerEmployeeAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerEmployeeAssessmentsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerEmployeeAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
