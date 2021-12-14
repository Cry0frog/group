import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDisplayCommonInfoComponent } from './map-display-common-info.component';

describe('MapDisplayCommonInfoComponent', () => {
  let component: MapDisplayCommonInfoComponent;
  let fixture: ComponentFixture<MapDisplayCommonInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapDisplayCommonInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapDisplayCommonInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
