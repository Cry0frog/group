import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsActivityComponent } from './fields-activity.component';

describe('FieldsActivityComponent', () => {
  let component: FieldsActivityComponent;
  let fixture: ComponentFixture<FieldsActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldsActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
