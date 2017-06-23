import { AddressService } from '../../services/address.service';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { AppSettingsService } from '../../services/app-settings.service';
import { BlandPageService } from '../../services/bland-page.service';
import { ContentBlockModule } from 'crds-ng2-content-block';
import { FormsModule } from '@angular/forms';
import {
  GeoCoordinates,
  Pin,
  PinSearchRequestParams,
  PinSearchResultsDto,
  SearchOptions
  } from '../../models';
import { GoogleMapClusterDirective } from '../../directives/google-map-cluster.directive';
import { GoogleMapService } from '../../services/google-map.service';
import { Http, RequestOptions, Response } from '@angular/http';
import { HttpModule } from '@angular/http';
import { initialMapZoom } from '../../shared/constants';
import { IPService } from '../../services/ip.service';
import { ListEntryComponent } from '../../components/list-entry/list-entry.component';
import { ListFooterComponent } from '../../components/list-footer/list-footer.component';
import { ListViewComponent } from '../../components/list-view/list-view.component';
import { LocationService } from '../../services/location.service';
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


describe('Component: Neighbors', () => {
  let mockAppSettingsService,
    mockUserLocationService,
    mockPinService,
    mockGoogleMapService,
    mockNeighborsHelperService,
    mockStateService,
    mockSearchService,
    mockRouter,
    subject;

  beforeEach(() => {
    subject = new Subject();
    mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettings', ['isConnectApp', 'isSmallGroupApp']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['getPinSearchResults', 'reSortBasedOnCenterCoords', 'addNewPinToResultsIfNotUpdatedInAwsYet', 'ensureUpdatedPinAddressIsDisplayed', 'sortPinsAndRemoveDuplicates']);
    mockGoogleMapService = jasmine.createSpyObj<GoogleMapService>('mapHlpr', ['emitRefreshMap']);
    mockNeighborsHelperService = jasmine.createSpyObj<NeighborsHelperService>('neighborsHelperService', ['emitChange']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate', 'navigateByUrl']);
    mockStateService = jasmine.createSpyObj<StateService>('state', ['setUseZoom', 'setLoading', 'getMyViewOrWorldView', 'getCurrentView', 'getLastSearch', 'setCurrentView', 'setMapView', 'getMapView', 'setMyViewOrWorldView', 'setLastSearch']);
    mockUserLocationService = jasmine.createSpyObj<UserLocationService>('userLocationService', ['GetUserLocation']);
    mockPinService.pinSearchRequestEmitter = subject;
    TestBed.configureTestingModule({
      declarations: [
        NeighborsComponent,
        MockComponent({ selector: 'app-listview', inputs: ['searchResults']}),
        MockComponent({ selector: 'app-map', inputs: ['searchResults']}),
        MockComponent({ selector: 'app-search-bar', inputs:  ['isMapHidden', 'isMyStuffSearch', 'viewMap', 'search']}),
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
        { provide: UserLocationService, useValue: mockUserLocationService },
        { provide: PinService, useValue: mockPinService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: GoogleMapService, useValue: mockGoogleMapService },
        { provide: NeighborsHelperService, useValue: mockNeighborsHelperService },
        { provide: StateService, useValue: mockStateService },
        { provide: AppSettingsService, useValue: mockAppSettingsService },
        { provide: Router, useValue: mockRouter }
      ]
    });
    this.fixture = TestBed.createComponent(NeighborsComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should init map and get new results', () => {
    (mockUserLocationService.GetUserLocation).and.returnValue(Observable.of( { lat: 42, lng: 42 } ));
    (mockStateService.getCurrentView).and.returnValue('map');
    (mockStateService.getLastSearch).and.returnValue(null);

    spyOn(this.component, 'doSearch');
    this.component.ngOnInit();
    expect(mockStateService.setMapView).toHaveBeenCalledWith(new MapView('', 42, 42, initialMapZoom));
    expect(this.component.doSearch).toHaveBeenCalledWith(new PinSearchRequestParams(true, null));
    expect(this.component.doSearch).toHaveBeenCalledTimes(1);
    expect(subject.observers.length).toBe(1);
  });

  it('should doSearch when pinSearchRequestEmitter emits', () => {
    (mockUserLocationService.GetUserLocation).and.returnValue(Observable.of( { lat: 42, lng: 42 } ));
    (mockStateService.getCurrentView).and.returnValue('map');
    (mockStateService.getLastSearch).and.returnValue(null);

    spyOn(this.component, 'doSearch');
    this.component.ngOnInit();
    let searchParams = new PinSearchRequestParams(true, 'user search');
    subject.next(searchParams);
    expect(this.component.doSearch).toHaveBeenCalledTimes(2);
    expect(this.component.doSearch).toHaveBeenCalledWith(searchParams);
  });

  it('setView should set mapViewActive to true', () => {
    this.component.setViewToMapOrList('map');
    expect(this.component['mapViewActive']).toBe(true);
  });

  it('setView should set mapViewActive to false', () => {
    this.component.setViewToMapOrList('list');
    expect(this.component['mapViewActive']).toBe(false);
  });

  it('if viewChanged map view is not active should reSortBasedOnCenterCoords with location', () => {
    let mapView: MapView = new MapView('test', 42, 42, 6);
    let searchOptions: SearchOptions = new SearchOptions('searchy Search', 11, 11);
    let searchResults: PinSearchResultsDto = MockTestData.getAPinSearchResults(1);
    (mockStateService.getMapView).and.returnValue(mapView);
    (mockStateService.getLastSearch).and.returnValue(searchOptions);
    (mockPinService.reSortBasedOnCenterCoords).and.returnValue(searchResults.pinSearchResults .slice());
    this.component['pinSearchResults'] = searchResults;

    this.component.viewChanged(false);
    expect(this.component['mapViewActive']).toBe(false);
    expect(mockPinService.reSortBasedOnCenterCoords).toHaveBeenCalledWith(searchResults.pinSearchResults, new GeoCoordinates(42, 42));
  });

  it('if viewCHanged and map view is active reSortBasedOnCenterCoords should not be called', () => {
    this.component.viewChanged(true);
    expect(mockStateService.getMapView).not.toHaveBeenCalled();
    expect(mockStateService.getLastSearch).not.toHaveBeenCalled();
    expect(mockPinService.reSortBasedOnCenterCoords).not.toHaveBeenCalled();
  });

  it('should processAndDisplaySearchResults', () => {
    let searchResults: PinSearchResultsDto = MockTestData.getAPinSearchResults(1);
    this.component['pinSearchResults'] = searchResults;
    this.component['mapViewActive'] = true;
    (mockPinService.addNewPinToResultsIfNotUpdatedInAwsYet).and.returnValue(searchResults.pinSearchResults);
    (mockPinService.ensureUpdatedPinAddressIsDisplayed).and.returnValue(searchResults.pinSearchResults);
    (mockPinService.sortPinsAndRemoveDuplicates).and.returnValue(searchResults.pinSearchResults);
    spyOn(this.component, 'navigateAwayIfNecessary');

    this.component.processAndDisplaySearchResults('Searchy Search', 42, 42);
    expect(mockPinService.addNewPinToResultsIfNotUpdatedInAwsYet).toHaveBeenCalledWith(searchResults.pinSearchResults);
    expect(mockPinService.ensureUpdatedPinAddressIsDisplayed).toHaveBeenCalledWith(searchResults.pinSearchResults);
    expect(mockPinService.sortPinsAndRemoveDuplicates).toHaveBeenCalledWith(searchResults.pinSearchResults);
    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(mockNeighborsHelperService.emitChange).toHaveBeenCalledTimes(1);
    expect(mockGoogleMapService.emitRefreshMap).toHaveBeenCalledTimes(1);
    expect(this.component.navigateAwayIfNecessary).toHaveBeenCalledWith('Searchy Search', 42, 42);
  });

  it('shouldNavigateAway to no results page if pinsearch results is zero and on world map', () => {
    this.component['pinSearchResults'] = new PinSearchResultsDto(new GeoCoordinates(12, 32), []);
    (mockStateService.getMyViewOrWorldView).and.returnValue('world');
    spyOn(this.component, 'goToNoResultsPage');

    this.component.navigateAwayIfNecessary('searchySearch', 12, 32);

    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
    expect(this.component.goToNoResultsPage).toHaveBeenCalledTimes(1);
  });

  it('should navigate to add me to the map if in connect mode and my stuff mode and no search results', () => {
    this.component['pinSearchResults'] = new PinSearchResultsDto(new GeoCoordinates(12, 32), []);
    (mockStateService.getMyViewOrWorldView).and.returnValue('my');
    (mockAppSettingsService.isConnectApp).and.returnValue(true);
    this.component['state'].myStuffActive = true;

    this.component.navigateAwayIfNecessary('searchySearch', 12, 32);

    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
    expect(mockStateService.setMyViewOrWorldView).toHaveBeenCalledWith('world');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['add-me-to-the-map']);
    expect(this.component['state'].myStuffActive).toBe(false);
  });

  it('should navigate to stuff-not-found when in my stuff mode and group mode and no results', () => {
    this.component['pinSearchResults'] = new PinSearchResultsDto(new GeoCoordinates(12, 32), []);
    (mockStateService.getMyViewOrWorldView).and.returnValue('my');
    (mockAppSettingsService.isSmallGroupApp).and.returnValue(true);
    this.component['state'].myStuffActive = true;

    this.component.navigateAwayIfNecessary('searchySearch', 12, 32);

    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
    expect(mockStateService.setMyViewOrWorldView).toHaveBeenCalledWith('world');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['stuff-not-found']);
    expect(this.component['state'].myStuffActive).toBe(false);

  });

  it('should navigate directly to group if there is only 1 result and we are in group mode and we werent just navigated to a group', () => {
    let results = MockTestData.getAPinSearchResults(1);
    this.component['pinSearchResults'] = results;
    (mockStateService.getMyViewOrWorldView).and.returnValue('world');
    (mockAppSettingsService.isSmallGroupApp).and.returnValue(true);
    this.component['state'].myStuffActive = false;
    this.component['state'].navigatedDirectlyToGroup = false;

    this.component.navigateAwayIfNecessary('searchySearch', 12, 32);

    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
    expect(this.component['state'].myStuffActive).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`small-group/${results.pinSearchResults[0].gathering.groupId}/`]);
    expect(this.component['state'].navigatedDirectlyToGroup).toBe(true);

  });

  it('should set last search if results > 1 and everything is awesome (with lat / lng)', () => {
    this.component['pinSearchResults'] = MockTestData.getAPinSearchResults(10);
    (mockStateService.getMyViewOrWorldView).and.returnValue('world');
    (mockStateService.getLastSearch).and.returnValue(new SearchOptions('words', 22, 34));
    (mockAppSettingsService.isSmallGroupApp).and.returnValue(true);
    this.component['state'].myStuffActive = false;
    this.component['state'].navigatedDirectlyToGroup = false;

    this.component.navigateAwayIfNecessary('searchySearch', 12, 32);
    expect(mockStateService.setLastSearch).toHaveBeenCalledWith(new SearchOptions('searchySearch', 12, 32));
  });

  it('should set last search if results > 1 and everything is awesome (without lat / lng)', () => {
    this.component['pinSearchResults'] = MockTestData.getAPinSearchResults(10);
    (mockStateService.getMyViewOrWorldView).and.returnValue('world');
    (mockStateService.getLastSearch).and.returnValue(new SearchOptions('words', 22, 34));
    (mockAppSettingsService.isSmallGroupApp).and.returnValue(true);
    this.component['state'].myStuffActive = false;
    this.component['state'].navigatedDirectlyToGroup = false;

    this.component.navigateAwayIfNecessary('searchySearch', null, undefined);
    expect(mockStateService.setLastSearch).toHaveBeenCalledWith(new SearchOptions('searchySearch', 22, 34));

  });

  it('should do search', () => {
    let results = MockTestData.getAPinSearchResults(5);
    (mockPinService.getPinSearchResults).and.returnValue(Observable.of(results));
    spyOn(this.component, 'processAndDisplaySearchResults');
    this.component['state'].lastSearch = new SearchOptions('words', 11, 11);

    this.component.doSearch(new PinSearchRequestParams(true, 'new words'));
    expect(this.component.processAndDisplaySearchResults).toHaveBeenCalledWith('new words', results.centerLocation.lat, results.centerLocation.lng);
    expect(this.component['pinSearchResults']).toBe(results);
    expect(this.component['state'].lastSearch.search).toBe('new words');
  });

  it('doSearch should handle error and go to no results page', () => {
    spyOn(this.component, 'goToNoResultsPage');
    (mockPinService.getPinSearchResults).and.returnValue(Observable.throw({error: 'oh noes'}));
    this.component['state'].lastSearch = new SearchOptions('words', 11, 11);

    this.component.doSearch(new PinSearchRequestParams(true, 'new words'));
    expect(mockPinService.getPinSearchResults).toHaveBeenCalled();
    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(this.component.goToNoResultsPage).toHaveBeenCalledTimes(1);
    expect(this.component['state'].lastSearch.search).toBe('new words');
  });

  it('goToNoResultsPage should setMapViewActive to true and route', () => {
    this.component['mapViewActive'] = true;
    this.component.goToNoResultsPage();
    expect(mockStateService.setCurrentView).toHaveBeenCalledWith('map');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/no-results');
  });

  it('goToNoResultsPage should setMapViewActive to false and route', () => {
    this.component['mapViewActive'] = false;
    this.component.goToNoResultsPage();
    expect(mockStateService.setCurrentView).toHaveBeenCalledWith('list');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/no-results');
  });

});
