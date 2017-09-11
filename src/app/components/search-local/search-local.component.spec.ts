import { AgmCoreModule } from 'angular2-google-maps/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { Http, RequestOptions, Response } from '@angular/http';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

import { AnalyticsService } from '../../services/analytics.service';
import { AppSettingsService } from '../../services/app-settings.service';
import { GoogleMapService } from '../../services/google-map.service';
import { PinLabelService } from '../../services/pin-label.service';
import { PinService } from '../../services/pin.service';
import { SearchService } from '../../services/search.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { UserLocationService } from '../../services/user-location.service';

import { GoogleMapClusterDirective } from '../../directives/google-map-cluster.directive';

import { MapComponent } from '../../components/map/map.component';
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';
import { SearchLocalComponent } from '../search-local/search-local.component';
import { MapSettings } from '../../models/map-settings';

describe('Component: SearchLocal', () => {
  let fixture: ComponentFixture<SearchLocalComponent>;
  let comp: SearchLocalComponent;
  let mockStateService, mockSessionService, mockAnaltyics, mockUserLocationService,
    mockPinService, mockPinLabelService, mockGoogleMapService, mockSearchService,
    mockAppSettingsService, mockEventEmitter;

  beforeEach(() => {
    mockStateService = jasmine.createSpyObj<StateService>('state', ['']);
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['']);
    mockAnaltyics = jasmine.createSpyObj<AnalyticsService>('analytics', ['']);
    mockUserLocationService = jasmine.createSpyObj<UserLocationService>('userLocationService', ['']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['']);
    mockPinLabelService = jasmine.createSpyObj<PinLabelService>('pinLabelService', ['']);
    mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('googleMapService', ['']);
    mockSearchService = jasmine.createSpyObj<SearchService>('searchService', ['']);
    mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettingService', ['']);
    mockEventEmitter = jasmine.createSpyObj<EventEmitter<MapView>>('eventEmitter', ['subscribe']);

    TestBed.configureTestingModule({
      declarations: [
        MapComponent,
        MapContentComponent,
        MapFooterComponent,
        GoogleMapClusterDirective,
        // TODO: Components above this line should use mock component. Will reduce number of mocks all around.
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
        // { provide: LocationService, useValue: mockLocationService },
        { provide: PinLabelService, useValue: mockPinLabelService },
        { provide: PinService, useValue: mockPinService },
        // { provide: SiteAddressService, useValue: mockSiteAddressService },
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: StateService, useValue: mockStateService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: AnalyticsService, useValue: mockAnaltyics },
        // { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        // { provide: BlandPageService, useValue: mockBlandPageService },
        // { provide: GoogleMapsAPIWrapper, useValue: mockGoogleMapsAPIWrapper },
        // { provide: CookieService, useValue: mockCookieService },
        { provide: SearchService, useValue: mockSearchService },
        // { provide: IPService, useValue: mockIPService },
        // { provide: NeighborsHelperService, useValue: mockNeighborsHelperService },
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
