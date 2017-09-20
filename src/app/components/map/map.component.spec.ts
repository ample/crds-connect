import { AnalyticsService } from '../../services/analytics.service';
import { Observable } from 'rxjs/Rx';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import 'rxjs/add/observable/of';

import { MapComponent } from '../../components/map/map.component';

import { UserLocationService } from '../../services/user-location.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { GoogleMapService } from '../../services/google-map.service';
import { PinLabelService } from '../../services/pin-label.service';
import { PinService}  from '../../services/pin.service';

import { MapSettings } from '../../models/map-settings';
import { MapView } from '../../models/map-view';

describe('Component: Map', () => {
  let  mockUserLocationService, mockPinLabelService, mockPinService,
    mockGoogleMapService, mockStateService, mockSessionService;

  beforeEach(() => {
        mockUserLocationService = jasmine.createSpyObj<UserLocationService>('userLocationService', ['constructor']);
        mockPinLabelService = jasmine.createSpyObj<PinLabelService>('pinLabelService', ['constructor']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['constructor']);
        mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('sessionService', ['constructor']);
        mockStateService = jasmine.createSpyObj<StateService>('googleMapService', ['constructor']);
        mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['constructor']);
    TestBed.configureTestingModule({
      declarations: [
        MapComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: UserLocationService, useValue: mockUserLocationService },
        { provide: PinLabelService, useValue: mockPinLabelService },
        { provide: PinService, useValue: mockPinService },
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: StateService, useValue: mockStateService },
        { provide: SessionService, useValue: mockSessionService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    mockGoogleMapService.mapViewUpdatedEmitter = Observable.of(MapView);
    this.fixture = TestBed.createComponent(MapComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should init map with existing results', () => {
    this.component.haveResults = true;
    this.fixture.searchResults = new MapSettings(null, null, 5, false, true);
    this.component.ngOnInit();
    expect(this.component.mapSettings.lat).toBeTruthy();
    expect(this.component.mapSettings.lng).toBeTruthy();
  });

  it('should init map and get new results', () => {
    this.component.haveResults = false;
    this.fixture.searchResults = new MapSettings(null, null, 5, false, true);
    this.component.ngOnInit();
    expect(this.component.mapSettings.lat).toBeTruthy();
    expect(this.component.mapSettings.lng).toBeTruthy();
  });
});
