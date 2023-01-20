import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManagerViewEmployeeObjectivesComponent} from './manager-view-employee-objectives.component';

describe('ManagerViewEmployeeObjectivesComponent', () => {
  let component: ManagerViewEmployeeObjectivesComponent;
  let fixture: ComponentFixture<ManagerViewEmployeeObjectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerViewEmployeeObjectivesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerViewEmployeeObjectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
