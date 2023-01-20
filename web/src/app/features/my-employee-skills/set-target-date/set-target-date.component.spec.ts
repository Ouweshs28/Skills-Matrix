import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SetTargetDateComponent} from './set-target-date.component';

describe('SetTargetDateComponent', () => {
  let component: SetTargetDateComponent;
  let fixture: ComponentFixture<SetTargetDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetTargetDateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetTargetDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
