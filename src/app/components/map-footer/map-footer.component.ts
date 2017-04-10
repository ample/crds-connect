import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { PinService } from '../../services/pin.service';
import { GoogleMapService } from '../../services/google-map.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
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
              private mapHlpr: GoogleMapService,
              private loginRedirectService: LoginRedirectService,
              private neighborsHelper: NeighborsHelperService,
              private router: Router,
              private state: StateService,
              private session: SessionService,
              private blandPageService: BlandPageService,
              private userLocationService: UserLocationService,
              private search: SearchService) { }

  public gettingStartedBtnClicked()  {
    this.state.setCurrentView('map');
    this.blandPageService.goToGettingStarted();
  }

  public myStuffBtnClicked = () =>  {

    this.pin.clearPinCache();

    this.state.setLoading(true);
    this.state.setCurrentView('map');
    this.state.setMyViewOrWorldView('my');

    if (!this.session.isLoggedIn()) {
      this.loginRedirectService.redirectToLogin('/neighbors');
    } else {
        this.userLocationService.GetUserLocation().subscribe(
            pos => {
                this.myPinSearchResults = new PinSearchResultsDto(new GeoCoordinates(pos.lat, pos.lng), new Array<Pin>());
                this.doSearch(pos.lat, pos.lng );
            }
        );
    }

  }

  doSearch(lat: number, lng: number) {
    this.pin.getPinSearchResults('', lat, lng).subscribe(
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

