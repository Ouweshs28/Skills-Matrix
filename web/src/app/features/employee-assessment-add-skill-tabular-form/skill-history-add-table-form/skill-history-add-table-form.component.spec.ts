import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SkillHistoryAddTableFormComponent} from './skill-history-add-table-form.component';

describe('SkillHistoryAddTableFormComponent', () => {
  let component: SkillHistoryAddTableFormComponent;
  let fixture: ComponentFixture<SkillHistoryAddTableFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillHistoryAddTableFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillHistoryAddTableFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
