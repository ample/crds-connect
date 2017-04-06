import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges } from '@angular/core';
import { GoogleMapService } from '../../services/google-map.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { crdsOakleyCoords } from '../../shared/constants';
import { CanvasMapOverlayComponent } from '../../components/canvas-map-overlay/canvas-map-overlay.component';
import { MapSettings } from '../../models/map-settings';
import { Address } from '../../models/address';
import { Pin, pinType } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';
import { SessionService } from '../../services/session.service';
import { UserLocationService } from '../../services/user-location.service';
import { GoogleMapClusterDirective } from '../../directives/google-map-cluster.directive';
import { GeoCoordinates } from '../../models/geo-coordinates';
import { MapView } from '../../models/map-view';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html'
})
export class MapComponent implements OnInit {

  @Input() searchResults: PinSearchResultsDto;

  public mapSettings: MapSettings = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 5, false, true);

  constructor(private userLocationService: UserLocationService,
              private pinHlpr: PinService,
              private router: Router,
              private mapHlpr: GoogleMapService,
              private state: StateService,
              private session: SessionService) {}

  public ngOnInit(): void {
    let haveResults = !!this.searchResults;
    if (haveResults) {
      let lat = this.searchResults.centerLocation.lat;
      let lng = this.searchResults.centerLocation.lng;
      let zoomToUse = this.state.getUseZoom();
      if (zoomToUse === -1) {
        this.mapSettings.zoom = this.mapHlpr.calculateZoom(15, lat, lng, this.searchResults.pinSearchResults, this.state.getMyViewOrWorldView());
      } else {
        this.mapSettings.zoom = zoomToUse;
        this.state.setUseZoom(-1);
      }
      this.mapSettings.lat = lat;
      this.mapSettings.lng = lng;
      let priorMapView = this.state.getMapView();
      if (priorMapView) {
        this.mapSettings.lat  = priorMapView.lat;
        this.mapSettings.lng  = priorMapView.lng;
        this.mapSettings.zoom = priorMapView.zoom;
      }
    }
  }

  private displayDetails(pin: Pin) {
    this.state.setCurrentView('map');
    // Both Person Pin and Gathering Pin navigate to pin-details
    // Site Pin stays on map with info-window popup
    if (pin.pinType === pinType.PERSON) {
      this.router.navigate([`person/${pin.participantId}/`]);
    } else if (pin.pinType === pinType.GATHERING) {
      this.router.navigate([`gathering/${pin.gathering.groupId}/`]);
    }
  }

  public getStringByPinType(pin) {
    if (this.session.isCurrentPin(pin)) {
      return '//www.thebankofgreenecounty.com/wp-content/uploads/2016/08/placeholder-small.png';
    }
    switch (pin.pinType) {
      case pinType.PERSON:
        return '//crds-cms-uploads.s3.amazonaws.com/connect/PERSON.svg';
      case pinType.GATHERING:
        return '//crds-cms-uploads.s3.amazonaws.com/connect/GATHERING.svg';
      default:
        return '//crds-cms-uploads.s3.amazonaws.com/connect/SITE.svg';
    }
  }

  public getLabelName(pin: Pin) {
    return (this.getFirstNameOrSiteName(pin) + '|' + this.getLastInitial(pin) + '|' +
      this.hostOrEmptyString(pin) + '|' + this.isMe(pin));
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
