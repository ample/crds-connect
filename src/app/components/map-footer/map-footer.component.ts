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

  @Output() searchResultsEmitter: EventEmitter<PinSearchResultsDto>;

  constructor(private pin: PinService,
              private mapHlpr: GoogleMapService,
              private loginRedirectService: LoginRedirectService,
              private neighborsHelper: NeighborsHelperService,
              private router: Router,
              private state: StateService,
              private session: SessionService,
              private blandPageService: BlandPageService,
              private userLocationService: UserLocationService) {

    this.searchResultsEmitter = new EventEmitter<PinSearchResultsDto>();
  }

  public gettingStartedBtnClicked()  {
    this.state.setCurrentView('map');
    this.blandPageService.goToGettingStarted();
  }

// TODO -- my stuff -- then basic search typing into search box
// then my stuff again -- failed - did not get my stuff???
  public myStuffBtnClicked = () =>  {
    this.state.setLoading(true);
    this.state.setCurrentView('map');
    this.state.setMyViewOrWorldView('my');

    if (!this.session.isLoggedIn()) {
        this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url, this.myStuffBtnClicked);
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
        this.searchResultsEmitter.emit(this.myPinSearchResults);
        this.state.setLoading(false);

        if (this.state.getCurrentView() === 'map') {
          this.mapHlpr.emitRefreshMap(this.myPinSearchResults.centerLocation);
        }

        if ( this.myPinSearchResults.pinSearchResults.length === 0) {
          this.state.setLoading(false);
          this.router.navigate(['/add-me-to-the-map']);
        } else {
          this.router.navigate(['/map']);
        }
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

