import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMapsAPIWrapper, MapsAPILoader } from 'angular2-google-maps/core';
import { GoogleMapService } from '../../services/google-map.service';
import { MapContentComponent } from './map-content.component';
import { StateService } from '../../services/state.service';

describe('MapContentComponent', () => {
  let component: MapContentComponent;
  let fixture: ComponentFixture<MapContentComponent>;
  let mockGoogleMapService,
      mockGoogleMapsAPIWrapper,
      mockStateService;

  beforeEach(async(() => {
        mockGoogleMapService = { emitMapViewUpdated: jest.fn(), emitClearMap: jest.fn() };
        mockGoogleMapsAPIWrapper = { getNativeMap: jest.fn() };
        mockStateService = { setMapView: jest.fn() };
    TestBed.configureTestingModule({
      declarations: [
        MapContentComponent
      ],
      providers: [
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: GoogleMapsAPIWrapper, useValue: mockGoogleMapsAPIWrapper },
        { provide: StateService, useValue: mockStateService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapContentComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
