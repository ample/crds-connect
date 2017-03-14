import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapsAPIWrapper, MapsAPILoader } from 'angular2-google-maps/core';

import { GoogleMapService } from '../../services/google-map.service';

import { MapContentComponent } from './map-content.component';

describe('MapContentComponent', () => {
  let component: MapContentComponent;
  let fixture: ComponentFixture<MapContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapContentComponent ],
      providers: [ GoogleMapService, GoogleMapsAPIWrapper, MapsAPILoader ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});