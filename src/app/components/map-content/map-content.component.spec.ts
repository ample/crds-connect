import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapsAPILoader } from 'angular2-google-maps/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core/services.js';
import { GoogleMapService } from '../../services/google-map.service';
import { MapContentComponent } from './map-content.component';
import { StateService } from '../../services/state.service';
import { AppSettingsService } from '../../services/app-settings.service';

describe('MapContentComponent', () => {
  let component: MapContentComponent;
  let fixture: ComponentFixture<MapContentComponent>;
  let mockGoogleMapService,
      mockGoogleMapsAPIWrapper,
      mockMapsAPILoader,
      mockStateService,
      mockAppSettingsService;

  beforeEach(async(() => {
        mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('sessionService', ['constructor']);
        mockGoogleMapsAPIWrapper = jasmine.createSpyObj<GoogleMapsAPIWrapper>('googleMapsAPIWrapper', ['constructor']);
        mockMapsAPILoader = jasmine.createSpyObj<MapsAPILoader>('googleMapsAPILoader', ['constructor']);
        mockStateService = jasmine.createSpyObj<StateService>('googleMapService', ['constructor']);
        mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettingsService', ['isSmallGroupApp']);
    TestBed.configureTestingModule({
      declarations: [
        MapContentComponent
      ],
      providers: [
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: GoogleMapsAPIWrapper, useValue: mockGoogleMapsAPIWrapper },
        { provide: MapsAPILoader, useValue: mockMapsAPILoader },
        { provide: StateService, useValue: mockStateService },
        { provide: AppSettingsService, useValue: mockAppSettingsService }
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
