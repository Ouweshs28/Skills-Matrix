import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSearchCategoryComponent} from './list-search-category.component';

describe('ListSearchCategoryComponent', () => {
  let component: ListSearchCategoryComponent;
  let fixture: ComponentFixture<ListSearchCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSearchCategoryComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSearchCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
