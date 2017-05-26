import { Observable } from 'rxjs/Rx';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import 'rxjs/add/observable/of';
import { AppSettingsService } from '../../services/app-settings.service';
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
import { LoginRedirectService } from '../../services/login-redirect.service';
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { PinLabelService } from '../../services/pin-label.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LocationService } from '../../services/location.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { PinService}  from '../../services/pin.service';
import { GoogleMapClusterDirective } from  '../../directives/google-map-cluster.directive';
import { BlandPageService } from '../../services/bland-page.service';
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
        mockCookieService,
        mockAngulartics2,
        mockLoginRedirectService,
        mockBlandPageService,
        mockIPService,
        mockGoogleMapsAPIWrapper,
        mockSearchService,
        mockNeighborsHelperService,
        mockAppSettingsService;

  beforeEach(() => {
        mockSiteAddressService = jasmine.createSpyObj<SiteAddressService>('siteAddressService', ['constructor']);
        mockUserLocationService = jasmine.createSpyObj<UserLocationService>('userLocationService', ['constructor']);
        mockLocationService = jasmine.createSpyObj<LocationService>('locationService', ['constructor']);
        mockPinLabelService = jasmine.createSpyObj<PinLabelService>('pinLabelService', ['constructor']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['constructor']);
        mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('sessionService', ['constructor']);
        mockStateService = jasmine.createSpyObj<StateService>('googleMapService', ['constructor']);
        mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['constructor']);
        mockCookieService = jasmine.createSpyObj<CookieService>('cookieService', ['constructor']);
        mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angulartics2', ['constructor']);
        mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['constructor']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['constructor']);
        mockIPService = jasmine.createSpyObj<IPService>('ipService', ['constructor']);
        mockGoogleMapsAPIWrapper = jasmine.createSpyObj<GoogleMapsAPIWrapper>('googleMapsAPIWrapper', ['constructor']);
        mockSearchService = jasmine.createSpyObj<SearchService>('searchService', ['constructor']);
        mockNeighborsHelperService = jasmine.createSpyObj<NeighborsHelperService>('neighborsHelperService', ['constructor']);
        mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('AppSettingsService', ['constructor']);
    TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        MapContentComponent,
        MapFooterComponent,
        GoogleMapClusterDirective,
        SearchLocalComponent,
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
        { provide: CookieService, useValue: mockCookieService },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: IPService, useValue: mockIPService },
        { provide: GoogleMapsAPIWrapper, useValue: mockGoogleMapsAPIWrapper },
        { provide: SearchService, useValue: mockSearchService },
        { provide: NeighborsHelperService, useValue: mockNeighborsHelperService },
        { provide: AppSettingsService, useValue: mockAppSettingsService }
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
