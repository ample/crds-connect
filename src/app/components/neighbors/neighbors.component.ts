import { Angulartics2 } from 'angulartics2';

import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AddressService } from '../../services/address.service';
import { PinService } from '../../services/pin.service';
import { GoogleMapService } from '../../services/google-map.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { StateService } from '../../services/state.service';
import { UserLocationService } from '../../services/user-location.service';
import { SearchService } from '../../services/search.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { MapView } from '../../models/map-view';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { SearchOptions } from '../../models/search-options';

@Component({
  selector: 'app-neighbors',
  templateUrl: 'neighbors.component.html'
})

export class NeighborsComponent implements OnInit, OnDestroy {
  public isMapHidden = false;
  public mapViewActive: boolean = true;
  public pinSearchResults: PinSearchResultsDto;
  private mySub: Subscription; // for my MyStuffEmitter

  constructor(private addressService: AddressService,
    private pinService: PinService,
    private mapHlpr: GoogleMapService,
    private neighborsHelper: NeighborsHelperService,
    private router: Router,
    private state: StateService,
    private userLocationService: UserLocationService,
    private searchService: SearchService) {

    searchService.doLocalSearchEmitter.subscribe((mapView: MapView) => {
      this.state.setUseZoom(mapView.zoom);
      this.doSearch('searchLocal', mapView.lat, mapView.lng, mapView.zoom);
    });

    this.mySub = searchService.mySearchResultsEmitter.subscribe((myStuffSearchResults) => {
      this.pinSearchResults = myStuffSearchResults as PinSearchResultsDto;
      this.processAndDisplaySearchResults('', this.pinSearchResults.centerLocation.lat, this.pinSearchResults.centerLocation.lng);
    });
  }

  public ngOnDestroy(): void {
    // If we don't unsubscribe we will get memory leaks and weird behavior. 
    this.mySub.unsubscribe();
  }

  public ngOnInit(): void {

    this.state.setActiveApp(this.router.url);

    let haveResults = !!this.pinSearchResults;

    if (!haveResults) {
      this.state.setLoading(true);
      this.setView(this.state.getCurrentView());
      let lastSearch = this.state.getLastSearch();
      if (lastSearch != null) {
        if (this.state.navigatedBackFromAuthComponent) {
          this.state.navigatedBackFromAuthComponent = false;
          this.state.setMyViewOrWorldView('world');
          this.runFreshSearch();
        } else {
          this.doSearch(lastSearch.search, lastSearch.coords.lat, lastSearch.coords.lng);
        }
      } else {
        this.runFreshSearch();
      }
    } else {
      this.setView(this.state.getCurrentView());
    }
  }

  runFreshSearch() {
    this.userLocationService.GetUserLocation().subscribe (
      pos => {
        this.pinSearchResults = new PinSearchResultsDto(new GeoCoordinates(pos.lat, pos.lng), new Array<Pin>());
        this.doSearch('useLatLng', pos.lat, pos.lng );
      }
    );
  }

  setView(mapOrListView): void {
    this.mapViewActive = mapOrListView === 'map';
  }

  viewChanged(isMapViewActive: boolean) {
    this.mapViewActive = isMapViewActive;
  }

  processAndDisplaySearchResults(searchString, lat, lng): void {
    // include posted pin if not included in results
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

    this.navigateAwayIfNoSearchResults(searchString, lat, lng );
  }

  private navigateAwayIfNoSearchResults(searchString: string, lat: number, lng: number): void {
    if (this.pinSearchResults.pinSearchResults.length === 0 && this.state.getMyViewOrWorldView() === 'world') {
      this.state.setLoading(false);
      this.goToNoResultsPage();
    } else if (this.pinSearchResults.pinSearchResults.length === 0 && this.state.getMyViewOrWorldView() === 'my') {
      this.state.setLoading(false);
      this.state.setMyViewOrWorldView('world');
      this.router.navigate(['add-me-to-the-map']);
    } else {
      let lastSearch = this.state.getLastSearch();
      if (!(lastSearch && lastSearch.search === searchString && lastSearch.coords.lat === lat && lastSearch.coords.lng === lng)) {
        // its a different search, clear the last mapView;
        this.state.setMapView(null);
      }

      this.state.setLastSearch(new SearchOptions(searchString, lat, lng));
    }
  }

  doSearch(searchString: string,  lat?: number, lng?: number, zoom?: number) {
    this.state.setLoading(true);
    this.pinService.getPinSearchResults(searchString, lat, lng, zoom).subscribe(
      next => {
        this.pinSearchResults = next as PinSearchResultsDto;
        this.processAndDisplaySearchResults(searchString, lat, lng);
      },
      error => {
        console.log(error);
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
  };

  private filterFoundPinElement = (pinFromResults: Pin): boolean => {
    let postedPin = this.state.postedPin;
    return (postedPin.participantId !== pinFromResults.participantId || postedPin.pinType !== pinFromResults.pinType);
  };

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
