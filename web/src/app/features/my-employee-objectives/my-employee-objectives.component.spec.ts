import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MyEmployeeObjectivesComponent} from './my-employee-objectives.component';

describe('MyEmployeeSkillsComponent', () => {
  let component: MyEmployeeObjectivesComponent;
  let fixture: ComponentFixture<MyEmployeeObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyEmployeeObjectivesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEmployeeObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
