import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPromotionComponent } from './admin-promotion.component';

describe('AdminPromotionComponent', () => {
  let component: AdminPromotionComponent;
  let fixture: ComponentFixture<AdminPromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
