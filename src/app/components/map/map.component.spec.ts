import { Observable } from '@angular-cli/ast-tools/node_modules/rxjs/Rx';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import 'rxjs/add/observable/of';
import { UserLocationService } from '../../services/user-location.service';
import { MapComponent } from '../../components/map/map.component';
import { SearchLocalComponent } from '../search-local/search-local.component';
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';
import { MockComponent } from '../../shared/mock.component';
import { SiteAddressService } from '../../services/site-address.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { GoogleMapService } from '../../services/google-map.service';
import { PinLabelService } from '../../services/pin-label.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LocationService } from '../../services/location.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { PinService}  from '../../services/pin.service';
import { GoogleMapClusterDirective } from  '../../directives/google-map-cluster.directive';
import { MapSettings } from '../../models/map-settings';
import { IPService } from '../../services/ip.service';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { SearchService } from '../../services/search.service';
import { MapView } from '../../models/map-view';

describe('Component: Map', () => {
      let mockSiteAddressService,
        mockUserLocationService,
        mockLocationService,
        mockPinLabelService,
        mockPinService,
        mockGoogleMapService,
        mockStateService,
        mockSessionService,
        mockIPService,
        mockGoogleMapsAPIWrapper,
        mockSearchService,
        mockNeighborsHelperService;

  beforeEach(() => {
       mockUserLocationService = { constructor: jest.fn() };
       mockPinLabelService = { createPinLabelDataJsonString: jest.fn() };
       mockPinService = { doesLoggedInUserOwnPin: jest.fn() };
       mockGoogleMapService = { calculateZoom: jest.fn() };
       mockStateService = { getUseZoom: jest.fn(), getMyViewOrWorldView: jest.fn(), setUseZoom: jest.fn(),
                            getMapView: jest.fn(), setCurrentView: jest.fn()};
      mockSessionService = { };
    TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        MockComponent({selector: 'app-map-content'}),
        MockComponent({selector: 'app-map-footer'}),
        GoogleMapClusterDirective,
        MockComponent({selector: 'search-local'}),
        MockComponent({selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass']})
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: SiteAddressService, useValue: mockSiteAddressService },
        { provide: UserLocationService, useValue: mockUserLocationService },
        { provide: LocationService, useValue: mockLocationService },
        { provide: PinLabelService, useValue: mockPinLabelService },
        { provide: PinService, useValue: mockPinService },
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: StateService, useValue: mockStateService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: IPService, useValue: mockIPService },
        { provide: GoogleMapsAPIWrapper, useValue: mockGoogleMapsAPIWrapper },
        { provide: SearchService, useValue: mockSearchService },
        { provide: NeighborsHelperService, useValue: mockNeighborsHelperService }
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
