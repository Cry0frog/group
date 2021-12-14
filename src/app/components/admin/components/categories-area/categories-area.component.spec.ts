import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesAreaComponent } from './categories-area.component';

describe('CategoriesAreaComponent', () => {
  let component: CategoriesAreaComponent;
  let fixture: ComponentFixture<CategoriesAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
