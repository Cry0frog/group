import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatesAreaComponent } from './rates-area.component';

describe('RatesAreaComponent', () => {
  let component: RatesAreaComponent;
  let fixture: ComponentFixture<RatesAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatesAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
