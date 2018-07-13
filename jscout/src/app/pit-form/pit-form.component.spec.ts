import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitFormComponent } from './pit-form.component';

describe('PitFormComponent', () => {
  let component: PitFormComponent;
  let fixture: ComponentFixture<PitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PitFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
