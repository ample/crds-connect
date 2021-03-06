import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { GoogleMapService } from '../../services/google-map.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { crdsOakleyCoords, ViewType, ClusterStyles, MaxZoomForClustering } from '../../shared/constants';
import { MapSettings } from '../../models/map-settings';
import { Address } from '../../models/address';
import { Pin, pinType } from '../../models/pin';
import { PinLabelService } from '../../services/pin-label.service';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';
import { SessionService } from '../../services/session.service';
import { UserLocationService } from '../../services/user-location.service';
import { GeoCoordinates } from '../../models/geo-coordinates';
import { MapView } from '../../models/map-view';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html'
})
export class MapComponent implements OnInit {

  @Input() searchResults: PinSearchResultsDto;
  private styles = ClusterStyles;
  private maxZoom: number = MaxZoomForClustering;
  private averageCenter: boolean = true;

  public pinsToMap: Pin[] ;

  public mapSettings: MapSettings = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 5, false, true);

  constructor(private userLocationService: UserLocationService,
              private pinLabelService: PinLabelService,
              private pinHlpr: PinService,
              private router: Router,
              private mapHlpr: GoogleMapService,
              private state: StateService,
              private session: SessionService) {}

  public ngOnInit(): void {

    let haveResults = !!this.searchResults;
    if (haveResults) {

      this.pinsToMap = this.getPinsToMap();

      let lat = this.searchResults.centerLocation.lat;
      let lng = this.searchResults.centerLocation.lng;
      let zoomToUse = this.state.getUseZoom();
      if (zoomToUse === -1) {
        this.mapSettings.zoom = this.mapHlpr.calculateZoom(15, lat, lng,
                                                          this.getPinsToMap(), this.state.getMyViewOrWorldView());
      } else {
        this.mapSettings.zoom = zoomToUse;
        this.state.setUseZoom(-1);
      }
      this.mapSettings.lat = lat;
      this.mapSettings.lng = lng;
      let priorMapView = this.state.getMapView();
      if (priorMapView && this.mapSettings.lat === 0 && this.mapSettings.lng === 0) {
        this.mapSettings.lat  = priorMapView.lat;
        this.mapSettings.lng  = priorMapView.lng;
        this.mapSettings.zoom = priorMapView.zoom;
      }
    }
  }

  private getPinsToMap(): Pin[] {
    let pinsWithAddresses = new Array<Pin>();
    if ( this.searchResults ) {
      pinsWithAddresses = this.searchResults.pinSearchResults.filter(x => x.address.addressId !==  null);
    }
    return pinsWithAddresses;
  }

  private pinClicked(pin: Pin) {
    this.state.setCurrentView(ViewType.MAP);
    this.pinHlpr.navigateToPinDetailsPage(pin);
  }

  public getFirstNameOrSiteName(pin: Pin) {
    return this.capitalizeFirstLetter(pin.firstName) || this.capitalizeFirstLetter(pin.siteName);
  }

  public getLastInitial(pin: Pin) {
    return pin.lastName ? this.capitalizeFirstLetter((pin.lastName.substring(0, 1)) + '.') : '';
  }

  public hostOrEmptyString(pin: Pin): string {
    return pin.pinType === pinType.GATHERING ? 'HOST' : '';
  }

  public isMe(pin: Pin): string {
    let isPinASite: boolean = pin.pinType === pinType.SITE;
    let doesUserOwnPin: boolean = this.pinHlpr.doesLoggedInUserOwnPin(pin);
    let shouldHaveMeLabel: boolean = !isPinASite && doesUserOwnPin;

    return shouldHaveMeLabel ? 'ME' : '';
  }

  public capitalizeFirstLetter(string) {
    let isStringEmptyOrNull = string === undefined || string === null || string === '';

    if (isStringEmptyOrNull) {
      return '';
    } else {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

}
