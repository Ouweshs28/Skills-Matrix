import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeclinedCommentsDialogComponent} from './declined-comments-dialog.component';

describe('DeclinedCommentsDialogComponent', () => {
  let component: DeclinedCommentsDialogComponent;
  let fixture: ComponentFixture<DeclinedCommentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeclinedCommentsDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclinedCommentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
