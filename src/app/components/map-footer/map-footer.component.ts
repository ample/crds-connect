import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';
import { GoogleMapService } from '../../services/google-map.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { StateService } from '../../services/state.service';
import { UserLocationService } from  '../../services/user-location.service';
import { BlandPageService } from '../../services/bland-page.service';
import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';

@Component({
  selector: 'app-map-footer',
  templateUrl: 'map-footer.component.html',
  styleUrls: ['map-footer.component.scss']
})
export class MapFooterComponent {
  public isMapHidden = false;
  public myPinSearchResults: PinSearchResultsDto;

  constructor(private api: APIService,
              private mapHlpr: GoogleMapService,
              private loginRedirectService: LoginRedirectService,
              private neighborsHelper: NeighborsHelperService,
              private router: Router,
              private state: StateService,
              private blandPageService: BlandPageService,
              private userLocationService: UserLocationService) { }

  public gettingStartedBtnClicked()  {
    this.state.setCurrentView('map');
    this.blandPageService.goToGettingStarted();
  }

  public myStuffBtnClicked()  {
    if (!this.api.isLoggedIn()) {
        this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url, this.myStuffBtnClicked);
    } else {
      this.state.setCurrentView('map');
      this.state.setMyViewOrWorldView('my');

      this.userLocationService.GetUserLocation().subscribe(
        pos => {
          this.myPinSearchResults = new PinSearchResultsDto(new GeoCoordinates(pos.lat, pos.lng), new Array<Pin>());
          this.doSearch(pos.lat, pos.lng );
        }
      );
    }
  }

  doSearch(lat: number, lng: number) {
    this.state.setLoading(true);

    this.api.getMyPinsSearchResults(lat, lng).subscribe(
      next => {
        this.myPinSearchResults = next as PinSearchResultsDto;
        this.myPinSearchResults.pinSearchResults =
          this.myPinSearchResults.pinSearchResults.sort(
            (p1: Pin, p2: Pin) => { return p1.proximity - p2.proximity; });

// TODO: set myPinSearchResults into cache

        this.state.setLoading(false);

// TODO: Do I need this??
        // this.mapHlpr.emitRefreshMap(this.myPinSearchResults.centerLocation);
// TODO: Do I need this??
        // this.neighborsHelper.emitChange();

        this.isMapHidden = true;
        setTimeout(() => {
          this.isMapHidden = false;
        }, 1);

        // TODO: if myPinsearchresults is empty then display -- Add me to the map
        if ( this.myPinSearchResults.pinSearchResults.length === 0) {
          this.state.setLoading(false);
          this.router.navigate(['/add-me-to-the-map']);
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

