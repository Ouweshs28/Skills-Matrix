import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ReviewerAssessmentComponent} from './reviewer-assessment.component';

describe('ReviewerAssessmentComponent', () => {
  let component: ReviewerAssessmentComponent;
  let fixture: ComponentFixture<ReviewerAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewerAssessmentComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewerAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
