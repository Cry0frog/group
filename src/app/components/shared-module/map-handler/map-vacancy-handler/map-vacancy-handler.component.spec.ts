import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapVacancyHandlerComponent } from './map-vacancy-handler.component';

describe('MapVacancyHandlerComponent', () => {
  let component: MapVacancyHandlerComponent;
  let fixture: ComponentFixture<MapVacancyHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapVacancyHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapVacancyHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
