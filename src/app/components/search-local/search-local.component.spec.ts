/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Http, Response, RequestOptions } from '@angular/http';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { UserLocationService } from '../../services/user-location.service';
import { MapComponent } from '../../components/map/map.component';
import { SearchLocalComponent } from '../search-local/search-local.component';
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';

import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { GoogleMapService } from '../../services/google-map.service';
import { Angulartics2 } from 'angulartics2';
import { RouterTestingModule } from '@angular/router/testing';
import { MapSettings } from '../../models/map-settings';
import { SearchService } from '../../services/search.service';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { GoogleMapClusterDirective } from '../../directives/google-map-cluster.directive';
import { HttpModule, JsonpModule } from '@angular/http';
import { IPService } from '../../services/ip.service';
import { PinService } from '../../services/pin.service';
import { SiteAddressService } from '../../services/site-address.service';
import { BlandPageService } from '../../services/bland-page.service';
import { LocationService } from '../../services/location.service';
import { PinLabelService } from '../../services/pin-label.service';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { EventEmitter } from '@angular/core';
import { MapView } from '../../models/map-view';

describe('Component: SearchLocal', () => {
  let fixture: ComponentFixture<SearchLocalComponent>;
  let comp: SearchLocalComponent;
  let mockStateService,
    mockSessionService,
    mockAngulartics2,
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
    mockEventEmitter;




  beforeEach(() => {
    mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader', 'setCurrentView', 'setMyViewOrWorldView', 'getCurrentView']);
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId', 'isLoggedIn']);
    mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', ['eventTrack']);
    mockSiteAddressService = jasmine.createSpyObj<SiteAddressService>('siteAddressService', ['']);
    mockUserLocationService = jasmine.createSpyObj<UserLocationService>('userLocationService', ['GetUserLocation']);
    mockLocationService = jasmine.createSpyObj<LocationService>('locationService', ['getCurrentPosition']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['getPinSearchResults']);
    mockPinLabelService = jasmine.createSpyObj<PinLabelService>('pinLabelService', ['constructor']);
    mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('googleMapService', ['constructor', 'setDidUserAllowGeoLoc']);
    mockGoogleMapsAPIWrapper = jasmine.createSpyObj<GoogleMapsAPIWrapper>('googleMapAPIWrapper', ['constructor']);
    mockNeighborsHelperService = jasmine.createSpyObj<NeighborsHelperService>('neighborsHelperService', ['']);
    mockStateService = jasmine.createSpyObj<StateService>('stateService', ['setUseZoom', 'setLoading', 'getMyViewOrWorldView', 'getCurrentView', 'getLastSearch', 'setCurrentView']);
    mockSearchService = jasmine.createSpyObj<SearchService>('searchService', ['']);
    mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['getContactId', 'get', 'isLoggedIn']);
    mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['']);
    mockIPService = jasmine.createSpyObj<IPService>('ipService', ['']);
    mockCookieService = jasmine.createSpyObj<CookieService>('cookieService', ['constructor']);
    mockEventEmitter = jasmine.createSpyObj<EventEmitter<MapView>>('eventEmitter', ['subscribe']);


    TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        MapContentComponent,
        MapFooterComponent,
        GoogleMapClusterDirective,
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
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: GoogleMapsAPIWrapper, useValue: mockGoogleMapsAPIWrapper },
        { provide: CookieService, useValue: mockCookieService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: IPService, useValue: mockIPService },
        { provide: NeighborsHelperService, useValue: mockNeighborsHelperService }
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
