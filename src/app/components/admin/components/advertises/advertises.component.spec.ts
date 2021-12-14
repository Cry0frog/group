import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisesComponent } from './advertises.component';

describe('AdvertisesComponent', () => {
  let component: AdvertisesComponent;
  let fixture: ComponentFixture<AdvertisesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
