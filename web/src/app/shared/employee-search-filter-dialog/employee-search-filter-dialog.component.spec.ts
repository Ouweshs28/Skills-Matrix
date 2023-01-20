import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EmployeeSearchFilterDialogComponent} from './employee-search-filter-dialog.component';

describe('EmployeeSearchFilterDialogComponent', () => {
  let component: EmployeeSearchFilterDialogComponent;
  let fixture: ComponentFixture<EmployeeSearchFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeSearchFilterDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSearchFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
