import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AnalyticsService } from '../../services/analytics.service';
import { AppSettingsService } from '../../services/app-settings.service';
import { BlandPageService } from '../../services/bland-page.service';
import { PinService } from '../../services/pin.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { StateService } from '../../services/state.service';
import { SessionService } from '../../services/session.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin, PinSearchResultsDto, SearchOptions } from '../../models';

import { ViewType } from '../../shared/constants';

@Component({
  selector: 'app-map-footer',
  templateUrl: 'map-footer.component.html'
})
export class MapFooterComponent implements OnInit {
  public isMapHidden = false;
  public myPinSearchResults: PinSearchResultsDto;

  constructor(private appSettings: AppSettingsService,
              private pinService: PinService,
              private loginRedirectService: LoginRedirectService,
              private router: Router,
              private state: StateService,
              private session: SessionService,
              private blandPageService: BlandPageService,
              private analytics: AnalyticsService) { }

  public ngOnInit() {
    this.redirectThenChangeToMyStuff = this.redirectThenChangeToMyStuff.bind(this);
  }

  public gettingStartedBtnClicked()  {
    this.state.setCurrentView(ViewType.MAP);
    this.blandPageService.goToGettingStarted();
  }

  public myStuffBtnClicked(): void {
    this.appSettings.isConnectApp() ? this.analytics.myConnections() : this.analytics.myGroups();

    if (this.state.myStuffActive) {
      this.changeStateToAllResults();
    } else {
      this.changeStateToMyStuff();
    }
  };

  public changeStateToAllResults() {

    this.state.lastSearch.keywordSearch = '';
    this.state.setIsMyStuffActive(false);

    this.pinService.clearPinCache();

    this.state.setLoading(true);
    this.router.navigate(['/']);
    this.state.setCurrentView(ViewType.MAP);
    this.state.setMyViewOrWorldView('world');

    let pinSearchRequest = new SearchOptions(null, null, null);
    this.pinService.emitPinSearchRequest(pinSearchRequest);
  }


  public redirectThenChangeToMyStuff() {
    this.changeStateToMyStuff();
    this.loginRedirectService.redirectToTarget();
  }

  public changeStateToMyStuff(): void {

    this.pinService.clearPinCache();

    this.state.setLoading(true);

    if (!this.session.isLoggedIn()) {
      this.loginRedirectService.redirectToLogin('/', this.redirectThenChangeToMyStuff);
    } else {
      this.router.navigate(['/']);
      this.state.setCurrentView(ViewType.MAP);
      this.state.setMyViewOrWorldView('my');
      this.state.setIsMyStuffActive(true);

      let pinSearchRequest = new SearchOptions(null, null, null);

      this.pinService.emitPinSearchRequest(pinSearchRequest);
    }
  }

}
