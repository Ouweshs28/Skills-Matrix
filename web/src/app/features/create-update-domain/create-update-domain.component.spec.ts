import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateUpdateDomainComponent} from './create-update-domain.component';

describe('CreateUpdateDomainComponent', () => {
  let component: CreateUpdateDomainComponent;
  let fixture: ComponentFixture<CreateUpdateDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateDomainComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
