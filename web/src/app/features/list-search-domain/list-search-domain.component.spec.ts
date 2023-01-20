import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ListSearchDomainComponent} from './list-search-domain.component';

describe('ListSearchDomainComponent', () => {
  let component: ListSearchDomainComponent;
  let fixture: ComponentFixture<ListSearchDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSearchDomainComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSearchDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
