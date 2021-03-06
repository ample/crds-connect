import { AddressService } from '../../services/address.service';
import { AgmCoreModule } from '@agm/core';
import { AppSettingsService } from '../../services/app-settings.service';
import { BlandPageService } from '../../services/bland-page.service';
import { ContentBlockModule } from 'crds-ng2-content-block';
import { FormsModule } from '@angular/forms';
import { GeoCoordinates, Pin, PinSearchRequestParams, PinSearchResultsDto, SearchOptions } from '../../models';
import { GoogleMapService } from '../../services/google-map.service';
import { Http, RequestOptions, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { initialMapZoom, ViewType } from '../../shared/constants';
import { IPService } from '../../services/ip.service';
import { ListEntryComponent } from '../../components/list-entry/list-entry.component';
import { ListFooterComponent } from '../../components/list-footer/list-footer.component';
import { ListViewComponent } from '../../components/list-view/list-view.component';
import { GeoLocationService } from '../../services/geo-location.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { MapComponent } from '../../components/map/map.component';
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';
import { MapView } from '../../models/map-view';
import { MockComponent } from '../../shared/mock.component';
import { MockTestData } from '../../shared/MockTestData';
import { NeighborsComponent } from './neighbors.component';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { Observable } from 'rxjs/Observable';
import { PinService } from '../../services/pin.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SearchLocalComponent } from '../../components/search-local/search-local.component';
import { SearchService } from '../../services/search.service';
import { SiteAddressService } from '../../services/site-address.service';
import { StateService } from '../../services/state.service';
import { Subject } from 'rxjs/Subject';
import { TestBed } from '@angular/core/testing';
import { UserLocationService } from '../../services/user-location.service';
import { FilterService } from '../../services/filter.service';
import { BlandPageComponent } from '../bland-page/bland-page.component';
import { BlandPageCause, BlandPageDetails, BlandPageType } from '../../models/bland-page-details';
import { PinIdentifier } from '../../models/pin-identifier';
import { pinType } from '../../models/pin';
import { PinCollectionProcessingService } from '../../services/pin-collection-processing.service';

describe('Component: Neighbors', () => {
  let mockAppSettingsService,
    mockUserLocationService,
    mockPinService,
    mockGoogleMapService,
    mockNeighborsHelperService,
    mockStateService,
    mockSearchService,
    mockRouter,
    mockFilterService,
    mockBlandService,
    mockPinCollectionProcessingService,
    subject;

  beforeEach(() => {
    subject = new Subject();
    mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettings', [
      'isConnectApp',
      'isSmallGroupApp',
      'routeToNotFoundPage'
    ]);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', [
      'getPinSearchResults',
      'reSortBasedOnCenterCoords',
      'sortPinsAndRemoveDuplicates',
      'removePinFromResultsIfDeleted',
      'buildPinSearchRequest'
    ]);
    mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('mapHlpr', ['emitRefreshMap']);
    mockNeighborsHelperService = jasmine.createSpyObj<NeighborsHelperService>('neighborsHelperService', ['emitChange']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate', 'navigateByUrl']);
    mockStateService = jasmine.createSpyObj<StateService>('state', [
      'setUseZoom',
      'setLoading',
      'getMyViewOrWorldView',
      'getDeletedPinIdentifier',
      'getLastSearch',
      'setCurrentView',
      'getCurrentView',
      'setMapView',
      'getMapView',
      'setMyViewOrWorldView',
      'setLastSearch',
      'setlastSearchResults',
      'isMapViewSet',
      'setLastSearchSearchString'
    ]);
    mockSearchService = jasmine.createSpyObj<SearchService>('searchService', [
      'navigateToListViewIfInGroupToolAndAllGroupsOnline'
    ]);
    mockUserLocationService = jasmine.createSpyObj<UserLocationService>('userLocationService', ['GetUserLocation']);
    mockPinService.pinSearchRequestEmitter = subject;
    mockFilterService = jasmine.createSpyObj<FilterService>('filterService', ['resetFilterString']);
    mockBlandService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);
    mockPinCollectionProcessingService = jasmine.createSpyObj<PinCollectionProcessingService>('', [
      'reSortBasedOnCenterCoords',
      'sortPinsAndRemoveDuplicates'
    ]);
    mockRouter = {
      url: '/',
      routerState: {
        snapshot: { url: '/' }
      },
      navigate: jasmine.createSpy('navigate'),
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    TestBed.configureTestingModule({
      declarations: [
        NeighborsComponent,
        MockComponent({ selector: 'app-listview', inputs: ['searchResults'] }),
        MockComponent({ selector: 'app-map', inputs: ['searchResults'] }),
        MockComponent({ selector: 'app-search-bar', inputs: ['isMapHidden', 'isMyStuffSearch', 'viewMap', 'search'] }),
        MockComponent({ selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass'] }),
        MockComponent({ selector: 'crds-content-block', inputs: ['id'] })
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpModule,
        ReactiveFormsModule,
        FormsModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        })
      ],
      providers: [
        { provide: UserLocationService, useValue: mockUserLocationService },
        { provide: PinService, useValue: mockPinService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: NeighborsHelperService, useValue: mockNeighborsHelperService },
        { provide: StateService, useValue: mockStateService },
        { provide: AppSettingsService, useValue: mockAppSettingsService },
        { provide: Router, useValue: mockRouter },
        { provide: BlandPageService, useValue: mockFilterService },
        { provide: PinCollectionProcessingService, useValue: mockPinCollectionProcessingService }
      ]
    });
    this.fixture = TestBed.createComponent(NeighborsComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should init map and get new results', () => {
    mockUserLocationService.GetUserLocation.and.returnValue(Observable.of({ lat: 42, lng: 42 }));
    mockStateService.getCurrentView.and.returnValue(ViewType.MAP);
    mockStateService.getLastSearch.and.returnValue(null);
    mockPinService.buildPinSearchRequest.and.returnValue(new PinSearchRequestParams(null, null, null));

    spyOn(this.component, 'doSearch');
    this.component.ngOnInit();
    expect(mockStateService.setMapView).toHaveBeenCalledWith(new MapView('', 42, 42, initialMapZoom));
    expect(this.component.doSearch).toHaveBeenCalledWith(new PinSearchRequestParams(null, null, null));
    expect(this.component.doSearch).toHaveBeenCalledTimes(1);
    expect(subject.observers.length).toBe(1);
  });

  it('should doSearch when pinSearchRequestEmitter emits', () => {
    mockUserLocationService.GetUserLocation.and.returnValue(Observable.of({ lat: 42, lng: 42 }));
    mockStateService.getCurrentView.and.returnValue(ViewType.MAP);
    mockStateService.getLastSearch.and.returnValue(null);

    spyOn(this.component, 'doSearch');
    this.component.ngOnInit();
    let searchParams = new PinSearchRequestParams('user search', null, null);
    subject.next(searchParams);
    expect(this.component.doSearch).toHaveBeenCalledTimes(2);
    expect(this.component.doSearch).toHaveBeenCalledWith(searchParams);
  });

  it('viewChanged toggles the view, reSortBasedOnCenterCoords is called when view is toggled to list', () => {
    let mapView: MapView = new MapView('test', 42, 42, 6);
    let searchOptions: SearchOptions = new SearchOptions('searchy Search', 'filter me', null);
    let searchResults: PinSearchResultsDto = MockTestData.getAPinSearchResults(1);
    mockStateService.getMapView.and.returnValue(mapView);
    mockStateService.getLastSearch.and.returnValue(searchOptions);
    mockPinCollectionProcessingService.reSortBasedOnCenterCoords.and.returnValue(
      searchResults.pinSearchResults.slice()
    );
    this.component['pinSearchResults'] = searchResults;

    // Toggle from map to list:
    mockStateService.getCurrentView.and.returnValue(ViewType.MAP);
    this.component.viewChanged();
    expect(mockStateService.setCurrentView).toHaveBeenCalledWith(ViewType.LIST);
    expect(mockStateService.getMapView).toHaveBeenCalled();
    expect(mockPinCollectionProcessingService.reSortBasedOnCenterCoords).toHaveBeenCalledWith(
      searchResults.pinSearchResults,
      new GeoCoordinates(42, 42)
    );

    // Toggle from list to map:
    mockStateService.getCurrentView.and.returnValue(ViewType.LIST);
    this.component.viewChanged();
    expect(mockStateService.setCurrentView).toHaveBeenCalledWith(ViewType.MAP);
    expect(mockStateService.getMapView).toHaveBeenCalledTimes(1); // Check that getMapView was not called again
    expect(mockPinCollectionProcessingService.reSortBasedOnCenterCoords).toHaveBeenCalledTimes(1); // Check that reSortBasedOnCenterCoords was not called again
  });

  it('should processAndDisplaySearchResults', () => {
    let searchResults: PinSearchResultsDto = MockTestData.getAPinSearchResults(1);
    this.component['pinSearchResults'] = searchResults;
    mockStateService.getDeletedPinIdentifier.and.returnValue(new PinIdentifier(pinType.PERSON, 123));
    mockStateService.getCurrentView.and.returnValue(ViewType.MAP);
    mockPinCollectionProcessingService.sortPinsAndRemoveDuplicates.and.returnValue(searchResults.pinSearchResults);
    spyOn(this.component, 'navigateAwayIfNecessary');

    this.component.processAndDisplaySearchResults('Searchy Search', 42, 42);
    expect(mockPinCollectionProcessingService.sortPinsAndRemoveDuplicates).toHaveBeenCalledWith(
      searchResults.pinSearchResults
    );
    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(mockNeighborsHelperService.emitChange).toHaveBeenCalledTimes(1);
    expect(mockGoogleMapService.emitRefreshMap).toHaveBeenCalledTimes(1);
    expect(this.component.navigateAwayIfNecessary).toHaveBeenCalledWith('Searchy Search', 42, 42, undefined, undefined);
  });

  it('shouldNavigateAway to no results page if pinsearch results is zero and on world map', () => {
    this.component['pinSearchResults'] = new PinSearchResultsDto(new GeoCoordinates(12, 32), []);
    mockStateService.getMyViewOrWorldView.and.returnValue('world');
    spyOn(this.component, 'goToNoResultsPage');

    this.component.navigateAwayIfNecessary('searchySearch', 12, 32);

    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
    expect(this.component.goToNoResultsPage).toHaveBeenCalledTimes(1);
  });

  it('should navigate to add me to the map if in connect mode and my stuff mode and no search results', () => {
    this.component['pinSearchResults'] = new PinSearchResultsDto(new GeoCoordinates(12, 32), []);
    mockStateService.getMyViewOrWorldView.and.returnValue('my');
    mockAppSettingsService.isConnectApp.and.returnValue(true);
    this.component['state'].myStuffActive = true;

    this.component.navigateAwayIfNecessary('searchySearch', 12, 32);

    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
    expect(mockStateService.setMyViewOrWorldView).toHaveBeenCalledWith('world');
    expect(mockAppSettingsService.routeToNotFoundPage).toHaveBeenCalled();
    expect(this.component['state'].myStuffActive).toBe(false);
  });

  it('should navigate to stuff-not-found when in my stuff mode and group mode and no results', () => {
    this.component['pinSearchResults'] = new PinSearchResultsDto(new GeoCoordinates(12, 32), []);
    mockStateService.getMyViewOrWorldView.and.returnValue('my');
    mockAppSettingsService.isSmallGroupApp.and.returnValue(true);
    this.component['state'].myStuffActive = true;

    this.component.navigateAwayIfNecessary('searchySearch', 12, 32);

    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
    expect(mockStateService.setMyViewOrWorldView).toHaveBeenCalledWith('world');
    expect(mockAppSettingsService.routeToNotFoundPage).toHaveBeenCalled();
    expect(this.component['state'].myStuffActive).toBe(false);
  });

  it('should navigate to groups-not-found when in my groups and no results', () => {
    this.component['pinSearchResults'] = new PinSearchResultsDto(new GeoCoordinates(12, 32), []);
    mockStateService.getMyViewOrWorldView.and.returnValue('my');
    mockAppSettingsService.isSmallGroupApp.and.returnValue(true);
    this.component['state'].myStuffActive = true;

    this.component.navigateAwayIfNecessary('searchySearch', 12, 32);

    expect(mockAppSettingsService.routeToNotFoundPage).toHaveBeenCalled();
    expect(mockRouter.navigate).toBeTruthy(['groups-not-found']);
    expect(this.component['state'].myStuffActive).toBe(false);
  });

  it('should navigate to connections-not-found when in my connections and no results', () => {
    this.component['pinSearchResults'] = new PinSearchResultsDto(new GeoCoordinates(12, 32), []);
    mockStateService.getMyViewOrWorldView.and.returnValue('my');
    mockAppSettingsService.isSmallGroupApp.and.returnValue(false);
    this.component['state'].myStuffActive = true;

    this.component.navigateAwayIfNecessary('searchySearch', 12, 32);

    expect(mockAppSettingsService.routeToNotFoundPage).toHaveBeenCalled();
    expect(mockRouter.navigate).toBeTruthy(['connections-not-found']);
    expect(this.component['state'].myStuffActive).toBe(false);
  });

  it('should set last search if results > 1 and everything is awesome (with lat / lng)', () => {
    this.component['pinSearchResults'] = MockTestData.getAPinSearchResults(10);
    mockStateService.getMyViewOrWorldView.and.returnValue('world');
    mockStateService.getLastSearch.and.returnValue(new SearchOptions('words', undefined, null));
    mockAppSettingsService.isSmallGroupApp.and.returnValue(true);
    this.component['state'].myStuffActive = false;

    this.component.navigateAwayIfNecessary(null, 'keywordSearchString', 12, 32, undefined);
    expect(mockStateService.setLastSearch).toHaveBeenCalledWith(
      new SearchOptions('keywordSearchString', undefined, null)
    );
  });

  it('should set last search if results > 1 and everything is awesome (without lat / lng)', () => {
    this.component['pinSearchResults'] = MockTestData.getAPinSearchResults(10);
    mockStateService.getMyViewOrWorldView.and.returnValue('world');
    mockStateService.getLastSearch.and.returnValue(new SearchOptions('words', undefined, null));
    mockAppSettingsService.isSmallGroupApp.and.returnValue(true);
    this.component['state'].myStuffActive = false;

    this.component.navigateAwayIfNecessary(null, 'keywordSearchString', null, undefined);
    expect(mockStateService.setLastSearch).toHaveBeenCalledWith(
      new SearchOptions('keywordSearchString', undefined, null)
    );
  });

  it('should do search', () => {
    let results = MockTestData.getAPinSearchResults(5);
    mockPinService.getPinSearchResults.and.returnValue(Observable.of(results));
    mockAppSettingsService.isSmallGroupApp.and.returnValue(true);
    spyOn(this.component, 'processAndDisplaySearchResults');
    this.component['state'].lastSearch = new SearchOptions('words', null, null);

    this.component.doSearch(new PinSearchRequestParams(null, 'keywordSearchString', null));
    expect(this.component.processAndDisplaySearchResults).toHaveBeenCalledWith(
      null,
      'keywordSearchString',
      results.centerLocation.lat,
      results.centerLocation.lng,
      null
    );
    expect(this.component['pinSearchResults']).toBe(results);
    expect(this.component['state'].lastSearch.search).toBe('keywordSearchString');
  });

  it('doSearch should handle error and go to error page', () => {
    spyOn(this.component, 'goToErrorPage');
    mockPinService.getPinSearchResults.and.returnValue(Observable.throw({ error: 'oh noes' }));
    mockAppSettingsService.isConnectApp.and.returnValue(true);
    mockBlandService.primeAndGo.and.returnValue(true);
    this.component['state'].lastSearch = new SearchOptions('words', 'filter me', null);

    this.component.doSearch(new PinSearchRequestParams('new words', null, null));
    expect(mockPinService.getPinSearchResults).toHaveBeenCalled();
    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(this.component.goToErrorPage).toHaveBeenCalledTimes(1);
  });

  it('goToNoResultsPage should route', () => {
    this.component.goToNoResultsPage();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/no-results');
  });
});
