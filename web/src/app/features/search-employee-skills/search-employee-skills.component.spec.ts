import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SearchEmployeeSkillsComponent} from './search-employee-skills.component';

describe('SearchEmployeeSkillsComponent', () => {
  let component: SearchEmployeeSkillsComponent;
  let fixture: ComponentFixture<SearchEmployeeSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchEmployeeSkillsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEmployeeSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
