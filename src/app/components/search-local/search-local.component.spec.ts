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
    mockAngulartics2,
    mockGoogleMapService,
    mockSearchService;

  beforeEach(() => {
    mockGoogleMapService = { mapViewUpdatedEmitter: {subscribe: jest.fn()}};
    mockStateService = { myStuffActive: null };
    mockSearchService = { emitLocalSearch: jest.fn() };
    mockAngulartics2 = { eventTrack: { next: jest.fn() }};

    TestBed.configureTestingModule({
      declarations: [
        SearchLocalComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        })
      ],
      providers: [
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: StateService, useValue: mockStateService },
        { provide: Angulartics2, useValue: mockAngulartics2 },
        { provide: SearchService, useValue: mockSearchService }
      ]
    });

    this.fixture = TestBed.createComponent(SearchLocalComponent);
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
    comp.ngOnInit();
    expect(comp.active).toBe(false);
  });

});
