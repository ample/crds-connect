import { Subject } from 'rxjs/Rx';
import { MockTestData } from '../../shared/MockTestData';
/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from '@angular-cli/ast-tools/node_modules/rxjs/Rx';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { UserLocationService } from '../../services/user-location.service';
import { NeighborsComponent } from './neighbors.component';
import { FormsModule } from '@angular/forms';
import { GoogleMapService } from '../../services/google-map.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { StateService } from '../../services/state.service';
import { SearchService } from '../../services/search.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PinService } from '../../services/pin.service';
import { GoogleMapClusterDirective } from '../../directives/google-map-cluster.directive';
import { BlandPageService } from '../../services/bland-page.service';
import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin, PinSearchResultsDto, MapView } from '../../models';
import { MockComponent } from '../../shared/mock.component';
import { AddressService } from '../../services/address.service';

describe('Component: Neighbors', () => {
  let mockUserLocationService,
    mockPinService,
    mockGoogleMapService,
    mockNeighborsHelperService,
    mockStateService,
    mockSearchService,
    mockAddressService;
  let pinSearchResults = new PinSearchResultsDto(new GeoCoordinates(0, 0), [MockTestData.getAPin(1), MockTestData.getAPin(2)]);

  beforeEach(() => {
    mockAddressService = { clearCache: jest.fn() };
    mockPinService = { getPinSearchResults: jest.fn() };
    mockGoogleMapService = { setDidUserAllowGeoLoc: jest.fn() };
    mockNeighborsHelperService = { emitChange: jest.fn() };
    mockStateService = { setUseZoom: jest.fn(), setLoading: jest.fn(), getMyViewOrWorldView: jest.fn(), setLastSearch: jest.fn(),
                         getCurrentView: jest.fn(), getLastSearch: jest.fn(), setCurrentView: jest.fn(), setMapView: jest.fn() };
    mockUserLocationService = { GetUserLocation: jest.fn(() => {return Observable.of({lat: 42, lng: 42 }); })};
    mockSearchService = {doLocalSearchEmitter: { subscribe: jest.fn() }, mySearchResultsEmitter: { subscribe: jest.fn() } };
    mockSearchService.doLocalSearchEmitter.subscribe.mockReturnValue(Observable.of(pinSearchResults));
    mockSearchService.mySearchResultsEmitter.subscribe.mockReturnValue(Subject.create(Observable.of(pinSearchResults)));
    mockPinService.getPinSearchResults.mockReturnValue(Observable.of(pinSearchResults));

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
        { provide: UserLocationService, useValue: mockUserLocationService },
        { provide: PinService, useValue: mockPinService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: NeighborsHelperService, useValue: mockNeighborsHelperService },
        { provide: StateService, useValue: mockStateService },
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
    this.fixture.pinSearchResults = new PinSearchResultsDto(new GeoCoordinates(0, 0), new Array<Pin>());
    this.component.ngOnInit();
    expect(this.component.pinSearchResults).toBeTruthy();
  });

  it('should init map and get new results', () => {
    this.component.haveResults = false;
    this.fixture.pinSearchResults = null;
    this.component.ngOnInit();
    expect(this.component.pinSearchResults).toBeTruthy();
  });

});
