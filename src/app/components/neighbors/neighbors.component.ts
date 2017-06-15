import { Angulartics2 } from 'angulartics2';

import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AddressService } from '../../services/address.service';
import { AppSettingsService } from '../../services/app-settings.service';
import { LocationService } from '../../services/location.service';
import { PinService } from '../../services/pin.service';
import { GoogleMapService } from '../../services/google-map.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { StateService } from '../../services/state.service';
import { UserLocationService } from '../../services/user-location.service';
import { SearchService } from '../../services/search.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { MapView } from '../../models/map-view';
import { Pin, pinType } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { PinSearchRequestParams } from '../../models/pin-search-request-params';
import { PinSearchQueryParams } from '../../models/pin-search-query-params';
import { SearchOptions } from '../../models/search-options';

@Component({
  selector: 'app-neighbors',
  templateUrl: 'neighbors.component.html'
})

export class NeighborsComponent implements OnInit, OnDestroy {
  public isMyStuffSearch: boolean = false;
  public isMapHidden: boolean = false;
  public mapViewActive: boolean = true;
  public pinSearchResults: PinSearchResultsDto;
  private pinSearchSub: Subscription;

  constructor( private appSettings: AppSettingsService,
               private addressService: AddressService,
               private pinService: PinService,
               private mapHlpr: GoogleMapService,
               private neighborsHelper: NeighborsHelperService,
               private router: Router,
               private state: StateService,
               private userLocationService: UserLocationService,
               private searchService: SearchService) {

    this.pinSearchSub = pinService.pinSearchRequestEmitter.subscribe((srchParams: PinSearchRequestParams) => {
      this.doSearch(srchParams);
    });
  }

  public ngOnDestroy(): void {
    this.pinSearchSub.unsubscribe();
  }

  public ngOnInit(): void {

    let haveResults: boolean = !!this.pinSearchResults;

    let pinSearchRequest = new PinSearchRequestParams(true, null);


    //TODO: Get rid of if chains
    if (haveResults) {
      this.state.setLoading(true);
      this.setView(this.state.getCurrentView());
      let lastSearch = this.state.getLastSearch();
      if (lastSearch == null) {
        this.doSearch(pinSearchRequest);
      }
    } else {
      this.setView(this.state.getCurrentView());
      this.userLocationService.GetUserLocation().subscribe(
        pos => {
          let initialMapView: MapView = new MapView('', pos.lat, pos.lng, 5); //TODO: Find where we set initial zoom and use it instead of magic number 5
          this.state.setMapView(initialMapView);
          this.doSearch(pinSearchRequest);
        }
      );
    }
  }

  setView(mapOrListView): void {
    this.mapViewActive = mapOrListView === 'map';
  }

  viewChanged(isMapViewActive: boolean) {
    this.mapViewActive = isMapViewActive;
    if (!isMapViewActive) {
      let location: MapView = this.state.getMapView();
      let lastSearch: SearchOptions = this.state.getLastSearch();
      let coords: GeoCoordinates = (location !== null ) ? location : lastSearch.coords;
      this.pinSearchResults.pinSearchResults =
          this.pinService.reSortBasedOnCenterCoords(this.pinSearchResults.pinSearchResults, coords);
    }
  }

  processAndDisplaySearchResults(searchString, lat, lng): void {
    this.verifyPostedPinExistence();
    this.ensureUpdatedPinAddressIsDisplayed();

    this.pinSearchResults.pinSearchResults =
        this.pinService.sortPinsAndRemoveDuplicates(this.pinSearchResults.pinSearchResults);

    this.state.setLoading(false);

    if (this.mapViewActive) {
      this.mapHlpr.emitRefreshMap(this.pinSearchResults.centerLocation);
    }

    this.neighborsHelper.emitChange();

    this.isMapHidden = true;

    setTimeout(() => {
      this.isMapHidden = false;
    }, 1);

    this.navigateAwayIfNecessary(searchString, lat, lng);
  }

  private navigateAwayIfNecessary(searchString: string, lat: number, lng: number): void {
    if (this.pinSearchResults.pinSearchResults.length === 0 && this.state.getMyViewOrWorldView() === 'world') {
      this.state.setLoading(false);
      this.goToNoResultsPage();
    } else if (this.pinSearchResults.pinSearchResults.length === 0 && this.state.getMyViewOrWorldView() === 'my' && this.appSettings.isConnectApp()) {
      this.state.setLoading(false);
      this.state.setMyViewOrWorldView('world');
      this.router.navigate(['add-me-to-the-map']);
      this.state.myStuffActive = false;
    } else if (this.pinSearchResults.pinSearchResults.length === 0 && this.state.getMyViewOrWorldView() === 'my' && this.appSettings.isSmallGroupApp()) {
      this.state.setLoading(false);
      this.state.setMyViewOrWorldView('world');
      this.router.navigate(['stuff-not-found']);
      this.state.myStuffActive = false;
    } else if (this.pinSearchResults.pinSearchResults.length === 1 && this.state.getMyViewOrWorldView() === 'my' && this.appSettings.isSmallGroupApp() && this.state.navigatedDirectlyToGroup === false) {
      this.state.setLoading(false);
      this.state.navigatedDirectlyToGroup = true;
      this.state.setMyViewOrWorldView('my');
      this.router.navigate([`small-group/${this.pinSearchResults.pinSearchResults[0].gathering.groupId}/`]);
    } else {
      let lastSearch = this.state.getLastSearch();
      if (!(lastSearch && lastSearch.search === searchString && lastSearch.coords.lat === lat && lastSearch.coords.lng === lng)) {
        // its a different search, clear the last mapView;
        this.state.setMapView(null);
      }

      if (lat === undefined || lng === undefined) {
        this.state.setLastSearch(new SearchOptions(searchString, lastSearch.coords.lat, lastSearch.coords.lng));
      } else {
        this.state.setLastSearch(new SearchOptions(searchString, lat, lng));
      }
    }
  }

  doSearch(searchParams: PinSearchRequestParams ) {
    this.state.setLoading(true);

    this.pinService.getPinSearchResults(searchParams).subscribe(
      next => {
        this.pinSearchResults = next as PinSearchResultsDto;
        this.processAndDisplaySearchResults(searchParams.userSearchString, next.centerLocation.lat, next.centerLocation.lng);
        this.state.lastSearch.search = searchParams.userSearchString;
      },
      error => {
        console.log(error);
        this.state.lastSearch.search = searchParams.userSearchString;
        this.state.setLoading(false);
        this.goToNoResultsPage();
      });
  }

  private goToNoResultsPage() {
    this.mapViewActive ? this.state.setCurrentView('map') : this.state.setCurrentView('list');
    this.router.navigateByUrl('/no-results');
  }

  private foundPinElement = (pinFromResults: Pin): boolean => {
    let postedPin = this.state.postedPin;
    return (postedPin.participantId === pinFromResults.participantId
    && postedPin.pinType === pinFromResults.pinType);
  }

  private filterFoundPinElement = (pinFromResults: Pin): boolean => {
    let postedPin = this.state.postedPin;
    return (postedPin.participantId !== pinFromResults.participantId || postedPin.pinType !== pinFromResults.pinType);
  }

  private verifyPostedPinExistence() {
    if (this.state.navigatedFromAddToMapComponent && this.state.postedPin) {
      this.state.navigatedFromAddToMapComponent = false;
      let isFound = this.pinSearchResults.pinSearchResults.find(this.foundPinElement);
      let pin = this.state.postedPin;
      if (isFound === undefined) {
        this.pinSearchResults.pinSearchResults.push(pin);
      } else { // filter out old pin and replace
        this.pinSearchResults.pinSearchResults = this.pinSearchResults.pinSearchResults.filter(this.filterFoundPinElement);
        this.pinSearchResults.pinSearchResults.push(pin);
      }
      this.addressService.clearCache();
      this.state.postedPin = null;
    }
  }

  private ensureUpdatedPinAddressIsDisplayed() {
    let wasPinAddressJustUpdated: boolean = !!this.state.navigatedFromAddToMapComponent && !!this.state.updatedPin;

    if (wasPinAddressJustUpdated) {

      this.pinSearchResults.pinSearchResults = this.pinService.replaceAddressOnUpdatedPin(
          this.pinSearchResults.pinSearchResults,
          this.state.updatedPin,
          this.state.updatedPinOldAddress
      );

      this.addressService.clearCache();

      this.state.cleanUpStateAfterPinUpdate();
    }
  }

}
