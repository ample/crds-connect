import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'app-map-footer',
  templateUrl: 'map-footer.component.html'
})
export class MapFooterComponent {
  public isMapHidden = false;
  public myPinSearchResults: PinSearchResultsDto;

  constructor(private pin: PinService,
              private loginRedirectService: LoginRedirectService,
              private router: Router,
              private state: StateService,
              private session: SessionService,
              private blandPageService: BlandPageService,
              private userLocationService: UserLocationService,
              private search: SearchService,
              private angulartics2: Angulartics2,
              private appSettings: AppSettingsService) { }

  public gettingStartedBtnClicked()  {
    this.state.setCurrentView('map');
    this.blandPageService.goToGettingStarted();
  }

  public myStuffBtnClicked = () => {
    this.angulartics2.eventTrack.next({ action: 'myStuff Button Click', properties: { category: 'Connect' }});
    this.pin.clearPinCache();

    this.state.setLoading(true);
    this.state.setCurrentView('map');
    this.state.setMyViewOrWorldView('my');
    this.state.myStuffActive = true;

    if (!this.session.isLoggedIn()) {
      let baseUrlToRedirectToAfterLogin: string = this.appSettings.getBaseUrlForCurrentApp();
      this.loginRedirectService.redirectToLogin(baseUrlToRedirectToAfterLogin);
    } else {
      this.userLocationService.GetUserLocation().subscribe(
          pos => {
              this.myPinSearchResults = new PinSearchResultsDto(new GeoCoordinates(pos.lat, pos.lng), new Array<Pin>());
              this.doSearch(pos.lat, pos.lng );
          }
      );
    }
  };

  doSearch(lat: number, lng: number) {
    this.pin.getPinSearchResults('', this.appSettings.finderType, lat, lng).subscribe(
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

