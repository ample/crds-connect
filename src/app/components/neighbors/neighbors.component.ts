import { Angulartics2 } from 'angulartics2';

import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
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

import { initialMapZoom } from '../../shared/constants';

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
               private pinService: PinService,
               private mapHlpr: GoogleMapService,
               private neighborsHelper: NeighborsHelperService,
               private router: Router,
               private state: StateService,
               private userLocationService: UserLocationService,
               private searchService: SearchService) { }

  public ngOnDestroy(): void {
    if (this.pinSearchSub) {
      this.pinSearchSub.unsubscribe();
    }
  }

  public ngOnInit(): void {
    this.pinSearchSub = this.pinService.pinSearchRequestEmitter.subscribe((srchParams: PinSearchRequestParams) => {
      this.doSearch(srchParams);
    });

    let pinSearchRequest = new PinSearchRequestParams(true, null);

    this.setView(this.state.getCurrentView());
    this.userLocationService.GetUserLocation().subscribe(
      pos => {
        let initialMapView: MapView = new MapView('', pos.lat, pos.lng, initialMapZoom);
        this.state.setMapView(initialMapView);
        this.doSearch(pinSearchRequest);
      }
    );

  }

  setView(mapOrListView): void {
    this.mapViewActive = mapOrListView === 'map';
  }

  viewChanged(isMapViewActive: boolean) {
    this.mapViewActive = isMapViewActive;
    if (!isMapViewActive) {
      let location: MapView = this.state.getMapView();
      let lastSearch: SearchOptions = this.state.getLastSearch();
      let coords: GeoCoordinates = (location !== null ) ? new GeoCoordinates(location.lat, location.lng) : lastSearch.coords;
      this.pinSearchResults.pinSearchResults =
          this.pinService.reSortBasedOnCenterCoords(this.pinSearchResults.pinSearchResults, coords);
    }
  }

  processAndDisplaySearchResults(searchString, lat, lng): void {
    // TODO: We can probably move these next three calls to be in pin service directly. But will cause more refactoring
    this.pinSearchResults.pinSearchResults =
        this.pinService.addNewPinToResultsIfNotUpdatedInAwsYet(this.pinSearchResults.pinSearchResults);

    this.pinSearchResults.pinSearchResults =
        this.pinService.ensureUpdatedPinAddressIsDisplayed(this.pinSearchResults.pinSearchResults);

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
  // TODO: Either consolidate these state.setLoading or remove them as it's done before this method is called
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
    } else if (this.pinSearchResults.pinSearchResults.length === 1 && this.appSettings.isSmallGroupApp() && this.state.navigatedDirectlyToGroup === false) {
      this.state.setLoading(false);
      this.state.navigatedDirectlyToGroup = true;
      this.router.navigate([`small-group/${this.pinSearchResults.pinSearchResults[0].gathering.groupId}/`]);
    } else {
      let lastSearch = this.state.getLastSearch();

      if (lat == null || lng == null) {
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
          // for (let i = 0; i < this.pinSearchResults.pinSearchResults.length; i++) {
          //   let pin = this.pinSearchResults.pinSearchResults[i];
          //   if (pin.pinType === pinType.GATHERING || pin.pinType === pinType.SMALL_GROUP) {
          //     console.log('**************');
          //     console.log(pin.gathering.meetingTime);
          //     console.log(pin.gathering.primaryContactFirstName);
          //     console.log(pin.gathering.primaryContactLastName);
          //     console.log('**************');
          //   }
          // }        
        this.processAndDisplaySearchResults(searchParams.userSearchString, next.centerLocation.lat, next.centerLocation.lng);
        this.state.lastSearch.search = searchParams.userSearchString; // Are we doing this twice? Here and in navigate away
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

}
