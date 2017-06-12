import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
import { PinService } from '../../services/pin.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { StateService } from '../../services/state.service';
import { SessionService } from '../../services/session.service';
import { UserLocationService } from  '../../services/user-location.service';
import { BlandPageService } from '../../services/bland-page.service';
import { SearchService } from '../../services/search.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { PinSearchQueryParams } from '../../models/pin-search-query-params';

@Component({
  selector: 'app-map-footer',
  templateUrl: 'map-footer.component.html'
})
export class MapFooterComponent implements OnInit {
  public isMapHidden = false;
  public myPinSearchResults: PinSearchResultsDto;

  constructor(private appSettings: AppSettingsService,
              private pin: PinService,
              private loginRedirectService: LoginRedirectService,
              private router: Router,
              private state: StateService,
              private session: SessionService,
              private blandPageService: BlandPageService,
              private userLocationService: UserLocationService,
              private search: SearchService,
              private angulartics2: Angulartics2) { }

  public ngOnInit() {
    this.redirectThenChangeToMyStuff = this.redirectThenChangeToMyStuff.bind(this);
  }

  public gettingStartedBtnClicked()  {
    this.state.setCurrentView('map');
    this.blandPageService.goToGettingStarted();
  }

  public myStuffBtnClicked(): void {
    this.angulartics2.eventTrack.next({ action: 'myStuff Button Click', properties: { category: 'Connect' }});

    if (this.state.myStuffActive) {
      this.changeStateToAllResults();
    } else {
      this.changeStateToMyStuff();
    }
  };

  public changeStateToAllResults() {

    this.state.setIsMyStuffActive(false);
    this.state.lastSearch.search = '';

    this.pin.clearPinCache();

    this.state.setLoading(true);
    this.state.setCurrentView('map');
    this.state.setMyViewOrWorldView('world');

    let mapView = this.state.getMapView();
    this.search.emitLocalSearch(mapView);
  }

  public redirectThenChangeToMyStuff(){
    this.changeStateToMyStuff();
    this.loginRedirectService.redirectToTarget();
  }

  public changeStateToMyStuff(): void {
    this.pin.clearPinCache();

    this.state.setLoading(true);

    if (!this.session.isLoggedIn()) {
      this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url, this.redirectThenChangeToMyStuff);
    } else {
      this.state.setCurrentView('map');
      this.state.setMyViewOrWorldView('my');
      this.state.myStuffActive = true;

      this.userLocationService.GetUserLocation().subscribe(
          pos => {
            this.myPinSearchResults = new PinSearchResultsDto(new GeoCoordinates(pos.lat, pos.lng), new Array<Pin>());
            this.doSearch(pos.lat, pos.lng );
          }
      );
    }
  }

  doSearch(lat: number, lng: number) {

    let queryParams = new PinSearchQueryParams('', this.appSettings.finderType, null, lat, lng, null, null, null, null);

    this.pin.getPinSearchResults(queryParams).subscribe(
        next => {
          this.myPinSearchResults = next as PinSearchResultsDto;
          this.myPinSearchResults.pinSearchResults =
              this.myPinSearchResults.pinSearchResults.sort(
                  (p1: Pin, p2: Pin) => { return p1.proximity - p2.proximity; });
          this.search.emitMyStuffSearch(this.myPinSearchResults);
        },
        error => {
          console.log(error);
          this.state.setLoading(false);
          this.state.setCurrentView('map');
          this.router.navigate(['/no-results']);
        }
    );
  }

}
