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
import { BlandPageComponent } from '../bland-page/bland-page.component';
import { BlandPageCause, BlandPageDetails, BlandPageType } from '../../models/bland-page-details';
import { BlandPageService } from '../../services/bland-page.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { MapView } from '../../models/map-view';
import { Pin, pinType } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { PinSearchRequestParams } from '../../models/pin-search-request-params';
import { SearchOptions } from '../../models/search-options';

import { initialMapZoom, ViewType } from '../../shared/constants';

@Component({
  selector: 'app-neighbors',
  templateUrl: 'neighbors.component.html'
})

export class NeighborsComponent implements OnInit, OnDestroy {
  public isMyStuffSearch: boolean = false;
  public isMapHidden: boolean = false;
  public pinSearchResults: PinSearchResultsDto;
  private pinSearchSub: Subscription;

  constructor(private appSettings: AppSettingsService,
    private pinService: PinService,
    private mapHlpr: GoogleMapService,
    private neighborsHelper: NeighborsHelperService,
    private router: Router,
    public state: StateService,
    private userLocationService: UserLocationService,
    private searchService: SearchService,
    private blandPageService: BlandPageService) { }

  public ngOnDestroy(): void {
    if (this.pinSearchSub) {
      this.pinSearchSub.unsubscribe();
    }
  }

  public ngOnInit(): void {
    this.setViewToMyStuffIfIndicatedByUrl();
    this.subscribeToListenForSearchRequests();
    this.runInitialPinSearch();
  }

  private isMapViewSet(): boolean {
    return this.state.getCurrentView() === ViewType.MAP;
  }

  public viewChanged(): void {
    if (this.isMapViewSet()) {
      this.state.setCurrentView(ViewType.LIST);
      let location: MapView = this.state.getMapView();
      let coords: GeoCoordinates = (location !== null) ? new GeoCoordinates(location.lat, location.lng) : new GeoCoordinates(null, null);
      this.pinSearchResults.pinSearchResults = this.pinService.reSortBasedOnCenterCoords(this.pinSearchResults.pinSearchResults, coords);
    } else {
      this.state.setCurrentView(ViewType.MAP);
    }
  }

  private processAndDisplaySearchResults(searchLocationString, searchKeywordString, lat, lng, filterString): void {
    // TODO: We can probably move these next three calls to be in pin service directly. But will cause more refactoring
    this.pinSearchResults.pinSearchResults =
      this.pinService.addNewPinToResultsIfNotUpdatedInAwsYet(this.pinSearchResults.pinSearchResults);

    this.pinSearchResults.pinSearchResults =
      this.pinService.ensureUpdatedPinAddressIsDisplayed(this.pinSearchResults.pinSearchResults);

    this.pinSearchResults.pinSearchResults =
      this.pinService.sortPinsAndRemoveDuplicates(this.pinSearchResults.pinSearchResults);

    this.pinSearchResults.pinSearchResults =
        this.pinService.removePinFromResultsIfDeleted(this.pinSearchResults.pinSearchResults,
                                                      this.state.getDeletedPinIdentifier());

    this.state.setLoading(false);

    if (this.isMapViewSet()) {
      this.mapHlpr.emitRefreshMap(this.pinSearchResults.centerLocation);
    }

    this.neighborsHelper.emitChange();

    this.isMapHidden = true;

    setTimeout(() => {
      this.isMapHidden = false;
    }, 1);

    this.navigateAwayIfNecessary(searchLocationString, searchKeywordString, lat, lng, filterString);
  }

  private navigateAwayIfNecessary(searchLocationString: string, searchKeywordString: string, lat: number, lng: number, filterString: string): void {
    if (this.pinSearchResults.pinSearchResults.length === 0 && this.state.getMyViewOrWorldView() === 'world') {
      this.state.setLoading(false);
      this.goToNoResultsPage();
    } else if (this.pinSearchResults.pinSearchResults.length === 0 && this.state.getMyViewOrWorldView() === 'my') {
      this.state.setLoading(false);
      this.state.setMyViewOrWorldView('world');
      this.appSettings.routeToNotFoundPage();
      this.state.myStuffActive = false;
    } else {
      this.searchService.navigateToListViewIfInGroupToolAndAllGroupsOnline(this.pinSearchResults.pinSearchResults);
      this.state.setLastSearch(new SearchOptions(searchKeywordString, filterString, searchLocationString));
    }
  }

  doSearch(searchParams: PinSearchRequestParams) {
    this.state.setLoading(true);

    this.pinService.getPinSearchResults(searchParams).subscribe(
      next => {
        this.pinSearchResults = next as PinSearchResultsDto;
        this.state.setlastSearchResults(this.pinSearchResults);
        this.processAndDisplaySearchResults(searchParams.userLocationSearchString,
          searchParams.userKeywordSearchString,
          next.centerLocation.lat,
          next.centerLocation.lng,
          searchParams.userFilterString);
        let lastSearchString = this.appSettings.isConnectApp() ? searchParams.userLocationSearchString
          : searchParams.userKeywordSearchString;
        if (this.state.lastSearch) {
          this.state.lastSearch.search = lastSearchString; // Are we doing this twice? Here and in navigate away
        } else {
          this.state.lastSearch = new SearchOptions('', '', '');
        };
      },
      error => {
        console.log(`Error returned from getPinSearchResults: ${error} `);

        let lastSearchString = this.appSettings.isConnectApp() ? searchParams.userLocationSearchString
          : searchParams.userKeywordSearchString;
        this.state.setLastSearchSearchString(lastSearchString);
        this.state.setLoading(false);
        if (error.status === 412) {
          this.goToNoResultsPage();
        } else {
          this.goToErrorPage();
        }
      }
    );
  }

  private goToErrorPage(): void {
    let errorText = `<h1 class="title soft-half-bottom">Oops</h1><div class="font-size-small font-family-base-light"><p>It looks like there was a problem. Please try again.</p></div>`;

    this.blandPageService.primeAndGo(
        new BlandPageDetails(
            'Go to map',
            errorText,
            BlandPageType.Text,
            BlandPageCause.Error,
            ''
        )
    );
  }

  private goToNoResultsPage(): void {
    this.router.navigateByUrl('/no-results');
  }

  private subscribeToListenForSearchRequests(): void {
    this.pinSearchSub = this.pinService.pinSearchRequestEmitter.subscribe((srchParams: PinSearchRequestParams) => {
      this.doSearch(srchParams);
    });
  }

  private runInitialPinSearch(): void {
    let locationFilter: string = (this.state.lastSearch) ? this.state.lastSearch.location : null;

    let pinSearchRequest: PinSearchRequestParams =
      this.pinService.buildPinSearchRequest(locationFilter, this.state.searchBarText);

    this.userLocationService.GetUserLocation().subscribe(
      pos => {
        if (!this.state.isMapViewSet()) {
          let initialMapView: MapView = new MapView('', pos.lat, pos.lng, initialMapZoom);
          this.state.setMapView(initialMapView);
        }
        this.doSearch(pinSearchRequest);
      }
    );
  }

  public setViewToMyStuffIfIndicatedByUrl(): void {
    const isMyStuffFlagPresent = (this.router.url === '/my') || (this.router.url.substring(0, this.router.url.indexOf('?')) === '/my');

    if (isMyStuffFlagPresent) {
      this.state.setCurrentView(ViewType.LIST);
      this.isMyStuffSearch = true;
      this.state.setIsMyStuffActive(true);
    }
  }
}
