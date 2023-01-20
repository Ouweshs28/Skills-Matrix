import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddSkillLevelDialogComponent} from './add-skill-level-dialog.component';

describe('AddSkillLevelDialogComponent', () => {
  let component: AddSkillLevelDialogComponent;
  let fixture: ComponentFixture<AddSkillLevelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSkillLevelDialogComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSkillLevelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
