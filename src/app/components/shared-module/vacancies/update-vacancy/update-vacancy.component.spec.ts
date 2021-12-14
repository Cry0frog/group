import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVacancyComponent } from './update-vacancy.component';

describe('UpdateVacancyComponent', () => {
  let component: UpdateVacancyComponent;
  let fixture: ComponentFixture<UpdateVacancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateVacancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
