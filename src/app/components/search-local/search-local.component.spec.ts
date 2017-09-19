import { AnalyticsService } from '../../services/analytics.service';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CookieOptionsArgs, CookieService } from 'angular2-cookie/core';
import { EventEmitter } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

import { AppSettingsService } from '../../services/app-settings.service';
import { BlandPageService } from '../../services/bland-page.service';
import { GoogleMapService } from '../../services/google-map.service';
import { IPService } from '../../services/ip.service';
import { LocationService } from '../../services/location.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { PinLabelService } from '../../services/pin-label.service';
import { PinService } from '../../services/pin.service';
import { SearchService } from '../../services/search.service';
import { SessionService } from '../../services/session.service';
import { SiteAddressService } from '../../services/site-address.service';
import { StateService } from '../../services/state.service';
import { UserLocationService } from '../../services/user-location.service';


import { MapComponent } from '../../components/map/map.component';
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';
import { SearchLocalComponent } from '../search-local/search-local.component';
import { MapSettings } from '../../models/map-settings';
import { MapView } from '../../models/map-view';
import { MockComponent } from '../../shared/mock.component';

describe('Component: SearchLocal', () => {
  let fixture: ComponentFixture<SearchLocalComponent>;
  let comp: SearchLocalComponent;
  let mockStateService,
    mockSessionService,
    mockAnaltyics,
    mockUserLocationService,
    mockLocationService,
    mockSiteAddressService,
    mockPinService,
    mockPinLabelService,
    mockGoogleMapService,
    mockGoogleMapsAPIWrapper,
    mockNeighborsHelperService,
    mockSearchService,
    mockLoginRedirectService,
    mockBlandPageService,
    mockIPService,
    mockCookieService,
    mockEventEmitter,
    mockAppSettingsService;


  beforeEach(() => {
    mockStateService = jasmine.createSpyObj<StateService>('state', ['']);
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId', 'isLoggedIn']);
    mockAnaltyics = jasmine.createSpyObj<AnalyticsService>('analytics', ['updateResultsPressed']);
    mockSiteAddressService = jasmine.createSpyObj<SiteAddressService>('siteAddressService', ['']);
    mockUserLocationService = jasmine.createSpyObj<UserLocationService>('userLocationService', ['GetUserLocation']);
    mockLocationService = jasmine.createSpyObj<LocationService>('locationService', ['getCurrentPosition']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['getPinSearchResults']);
    mockPinLabelService = jasmine.createSpyObj<PinLabelService>('pinLabelService', ['constructor']);
    mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('googleMapService', ['constructor', 'setDidUserAllowGeoLoc']);
    mockGoogleMapsAPIWrapper = jasmine.createSpyObj<GoogleMapsAPIWrapper>('googleMapAPIWrapper', ['constructor']);
    mockNeighborsHelperService = jasmine.createSpyObj<NeighborsHelperService>('neighborsHelperService', ['']);
    mockSearchService = jasmine.createSpyObj<SearchService>('searchService', ['']);
    mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['getContactId', 'get', 'isLoggedIn']);
    mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['']);
    mockIPService = jasmine.createSpyObj<IPService>('ipService', ['']);
    mockCookieService = jasmine.createSpyObj<CookieService>('cookieService', ['constructor']);
    mockEventEmitter = jasmine.createSpyObj<EventEmitter<MapView>>('eventEmitter', ['subscribe']);
    mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettingService', ['constructor']);

    TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        MapContentComponent,
        MapFooterComponent,
        // TODO: Components above this line should use mock component. Will reduce number of mocks all around.
        MockComponent({ selector: 'agm-marker-cluster', inputs: ['styles', 'maxZoom', 'averageCenter'] }),
        MockComponent({ selector: 'google-map-cluster', inputs: []}),
        SearchLocalComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        })
      ],
      providers: [
        { provide: UserLocationService, useValue: mockUserLocationService },
        { provide: LocationService, useValue: mockLocationService },
        { provide: PinLabelService, useValue: mockPinLabelService },
        { provide: PinService, useValue: mockPinService },
        { provide: SiteAddressService, useValue: mockSiteAddressService },
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: StateService, useValue: mockStateService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: AnalyticsService, useValue: mockAnaltyics },
        { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: GoogleMapsAPIWrapper, useValue: mockGoogleMapsAPIWrapper },
        { provide: CookieService, useValue: mockCookieService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: IPService, useValue: mockIPService },
        { provide: NeighborsHelperService, useValue: mockNeighborsHelperService },
        { provide: AppSettingsService, useValue: mockAppSettingsService}
      ]
    });

    this.fixture = TestBed.createComponent(MapComponent);
    this.component = this.fixture.componentInstance;

    this.component.haveResults = true;
    this.fixture.searchResults = new MapSettings(null, null, 5, false, true);
    this.component.ngOnInit();
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(SearchLocalComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should create an instance', () => {
    expect(comp).toBeTruthy();
  });

  it('should not be present if mapView is unchanged', () => {
    let element = document.querySelector('.search-local button');
    expect(element).toBe(null);
  });

  it('should call ngOnInit without exploding', () => {
    comp.mapHelper.mapViewUpdatedEmitter = mockEventEmitter;
    comp.ngOnInit();
    expect(comp.active).toBe(false);
  });

});
