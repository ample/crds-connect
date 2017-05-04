import { Angulartics2 } from 'angulartics2';
import * as moment from 'moment';
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges } from '@angular/core';
import { GoogleMapService } from '../../services/google-map.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { crdsOakleyCoords } from '../../shared/constants';
import { MapSettings } from '../../models/map-settings';
import { Address } from '../../models/address';
import { Pin, pinType } from '../../models/pin';
import { PinLabelService } from '../../services/pin-label.service';
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
export class MapComponent implements OnInit, OnChanges {

  @Input() searchResults: PinSearchResultsDto;

  public mapSettings: MapSettings = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 5, false, true);

  constructor(private userLocationService: UserLocationService,
              private pinLabelService: PinLabelService,
              private pinHlpr: PinService,
              private router: Router,
              private mapHlpr: GoogleMapService,
              private state: StateService,
              private session: SessionService) {}

  public ngOnInit(): void {
    console.log('map: ngOnInit');
    let haveResults = !!this.searchResults;
    if (haveResults) {
      let lat = this.searchResults.centerLocation.lat;
      let lng = this.searchResults.centerLocation.lng;
      let zoomToUse = this.state.getUseZoom();
      if (zoomToUse === -1) {
        this.mapSettings.zoom = this.mapHlpr.calculateZoom(15, lat, lng,
                                                          this.searchResults.pinSearchResults, this.state.getMyViewOrWorldView());
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

  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...
    console.log('map: ngOnChanges');
  }

  private displayDetails(pin: Pin) {
    console.log('map: displayDetails');
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
    let time = moment().format('HH:mm:ss:SSS');
    console.log('map: getStringByPinType' + time);
    /*let iconName: string;
    if (pin.pinType === pinType.SITE) {
      iconName = 'SITE';
<<<<<<< HEAD
    } else if (pin.pinType === pinType.GATHERING) {
      iconName = 'GATHERING';
    } else if (pin.pinType === pinType.PERSON && this.session.isCurrentPin(pin)) {
      iconName = 'ME';
=======
    
    } else if (pin.pinType === pinType.GATHERING) {
      iconName = 'GATHERING';
>>>>>>> logging
    } else {
      iconName = 'PERSON';
    }*/
    return 'http://crds-cms-uploads.s3.amazonaws.com/connect/PERSON.svg';
  }

  public getLabelName(pin: Pin) {
    let time = moment().format('HH:mm:ss:SSS');
    //console.log('map: getLabelName' + time);
    let name = this.pinLabelService.createPinLabelDataJsonString(pin);
    console.log('name:', name);
    console.log('title', pin.title);
    return name;
  }

  public getFirstNameOrSiteName(pin: Pin) {
    console.log('map: getFirstNameOrSiteName');
    return this.capitalizeFirstLetter(pin.firstName) || this.capitalizeFirstLetter(pin.siteName);
  }

  public getLastInitial(pin: Pin) {
    console.log('map: getLastInitial');
    return pin.lastName ? this.capitalizeFirstLetter((pin.lastName.substring(0, 1)) + '.') : '';
  }

  public hostOrEmptyString(pin: Pin): string {
    console.log('map: hostOrEmptyString');
    return pin.pinType === pinType.GATHERING ? 'HOST' : '';
  }

  public isMe(pin: Pin): string {
    console.log('map: isMe');
    let isPinASite: boolean = pin.pinType === pinType.SITE;
    let doesUserOwnPin: boolean = this.pinHlpr.doesLoggedInUserOwnPin(pin);
    let shouldHaveMeLabel: boolean = !isPinASite && doesUserOwnPin;

    return shouldHaveMeLabel ? 'ME' : '';
  }

  public capitalizeFirstLetter(string) {
    console.log('map: capitalizeFirstLetter');
    let isStringEmptyOrNull = string === undefined || string === null || string === '';

    if (isStringEmptyOrNull) {
      return '';
    } else {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

}
