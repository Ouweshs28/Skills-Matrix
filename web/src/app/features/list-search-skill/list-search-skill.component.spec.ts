import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSearchSkillComponent} from './list-search-skill.component';

describe('ListSearchSkillComponent', () => {
  let component: ListSearchSkillComponent;
  let fixture: ComponentFixture<ListSearchSkillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSearchSkillComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSearchSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
