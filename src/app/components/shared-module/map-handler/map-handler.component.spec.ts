import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapHandlerComponent } from './map-handler.component';

describe('MapHandlerComponent', () => {
  let component: MapHandlerComponent;
  let fixture: ComponentFixture<MapHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
