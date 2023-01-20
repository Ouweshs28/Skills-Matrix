import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MyEmployeeSkillsComponent} from './my-employee-skills.component';

describe('MyEmployeeSkillsComponent', () => {
  let component: MyEmployeeSkillsComponent;
  let fixture: ComponentFixture<MyEmployeeSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyEmployeeSkillsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEmployeeSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
