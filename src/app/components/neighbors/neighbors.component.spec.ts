/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { Http, Response, RequestOptions } from '@angular/http';
import { MapView } from '../../models/map-view';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { UserLocationService } from '../../services/user-location.service';
import { NeighborsComponent } from './neighbors.component';
import { ListViewComponent } from '../../components/list-view/list-view.component';
import { ListEntryComponent } from '../../components/list-entry/list-entry.component';
import { MapComponent } from '../../components/map/map.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SearchLocalComponent } from '../../components/search-local/search-local.component';
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';
import { FormsModule } from '@angular/forms';
import { ContentBlockModule } from 'crds-ng2-content-block';
import { SiteAddressService } from '../../services/site-address.service';
import { SessionService } from '../../services/session.service';
import { GoogleMapService } from '../../services/google-map.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { StateService } from '../../services/state.service';
import { SearchService } from '../../services/search.service';
import { ListFooterComponent } from '../../components/list-footer/list-footer.component';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { CookieService, CookieOptionsArgs, CookieOptions } from 'angular2-cookie/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { PinService } from '../../services/pin.service';
import { GoogleMapClusterDirective } from '../../directives/google-map-cluster.directive';
import { BlandPageService } from '../../services/bland-page.service';
import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { IPService } from '../../services/ip.service';
import { MockComponent } from '../../shared/mock.component';
import { AddressService } from '../../services/address.service';

describe('Component: Neighbors', () => {
  let mockSiteAddressService,
    mockUserLocationService,
    mockLocationService,
    mockPinService,
    mockGoogleMapService,
    mockNeighborsHelperService,
    mockStateService,
    mockSearchService,
    mockSessionService,
    mockCookieService,
    mockLoginRedirectService,
    mockBlandPageService,
    mockIPService,
    mockAddressService;

  beforeEach(() => {

    mockSiteAddressService = jasmine.createSpyObj<SiteAddressService>('siteAddressService', ['']);
    mockUserLocationService = jasmine.createSpyObj<UserLocationService>('userLocationService', ['GetUserLocation']);
    mockLocationService = jasmine.createSpyObj<LocationService>('locationService', ['getCurrentPosition']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['getPinSearchResults']);
    mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('googleMapService', ['constructor', 'setDidUserAllowGeoLoc']);
    mockNeighborsHelperService = jasmine.createSpyObj<NeighborsHelperService>('neighborsHelperService', ['']);
    mockStateService = jasmine.createSpyObj<StateService>('stateService', ['setUseZoom', 'setLoading', 'getMyViewOrWorldView', 'getCurrentView', 'getLastSearch', 'setCurrentView']);
    mockSearchService = jasmine.createSpyObj<SearchService>('searchService', ['']);
    mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['getContactId', 'get', 'isLoggedIn']);
    mockCookieService = jasmine.createSpyObj<CookieService>('cookieService', ['']);
    mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['']);
    mockIPService = jasmine.createSpyObj<IPService>('ipService', ['']);
    mockAddressService = jasmine.createSpyObj<AddressService>('addressService', ['']);

    TestBed.configureTestingModule({
      declarations: [
        NeighborsComponent,
        MockComponent({ selector: 'app-listview', inputs: ['searchResults']}),
        MockComponent({ selector: 'app-map', inputs: ['searchResults']}),
        MockComponent({ selector: 'app-search-bar', inputs:  ['isMapHidden']}),
        MockComponent({ selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass'] }),
        MockComponent({ selector: 'crds-content-block', inputs: ['id'] })
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, ReactiveFormsModule, FormsModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        })
      ],
      providers: [
        // These services could not be mocked and have the tests pass. The ngOnInit needs
        // major refactoring to make it testable. Sad.
        UserLocationService,
        LocationService,
        PinService,
        SearchService,
        SessionService,
        IPService,
        { provide: SiteAddressService, useValue: mockSiteAddressService },
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: NeighborsHelperService, useValue: mockNeighborsHelperService },
        { provide: StateService, useValue: mockStateService },
        { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: AddressService, useValue: mockAddressService }
      ]
    });
    this.fixture = TestBed.createComponent(NeighborsComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should init map with existing results', () => {
    this.component.haveResults = true;
    this.component.ngOnInit();
    expect(this.component.pinSearchResults).toBeTruthy();
  });

  it('should init map and get new results', () => {
    this.component.haveResults = false;
    this.fixture.pinSearchResults = new PinSearchResultsDto(new GeoCoordinates(0, 0), new Array<Pin>());
    this.component.ngOnInit();
    expect(this.component.pinSearchResults).toBeTruthy();
  });

});
