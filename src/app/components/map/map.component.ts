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
import { UserLocationService } from '../../services/user-location.service';
import { GoogleMapClusterDirective } from '../../directives/google-map-cluster.directive';
import { GeoCoordinates } from '../../models/geo-coordinates';

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
    private state: StateService) { }

  public ngOnInit(): void {
    let haveResults = !!this.searchResults;
    if (haveResults) {
      let lat = this.searchResults.centerLocation.lat;
      let lng = this.searchResults.centerLocation.lng;
      let zoomToUse = this.state.getUseZoom();
      if (zoomToUse === -1) {
        this.mapSettings.zoom = this.calculateZoom(15, lat, lng)
      } else {
        this.mapSettings.zoom = zoomToUse;
        this.state.setUseZoom(-1);
      }
      this.mapSettings.lat = lat;
      this.mapSettings.lng = lng;
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

  public getStringByPinType(type) {
    switch (type) {
      case pinType.PERSON:
        return 'http://crds-cms-uploads.s3.amazonaws.com/connect/PERSON.svg';
      case pinType.GATHERING:
        return 'http://crds-cms-uploads.s3.amazonaws.com/connect/GATHERING.svg';
      default:
        return 'http://crds-cms-uploads.s3.amazonaws.com/connect/SITE.svg';
    }
  }

  // get the best zoom level for the map
  private calculateZoom(zoom: number, lat: number, lng: number): number {
    let bounds = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      lat: lat,
      lng: lng
    }
    return this.calculateBestZoom(bounds, zoom);
  }

  // zero in on the zoom that's closest to the target pin count without going under
  private calculateBestZoom(bounds: Object, zoom: number, pops: Object = {}): number {
    let popTarget = 10;
    let pop = this.countPopAtZoom(bounds, zoom, pops);
    if (pop < popTarget) {
      if (zoom <= 8) {
        return 8;
      }
      return this.calculateBestZoom(bounds, zoom - 1, pops);
    } else if (zoom >= 20) {
      return 20;
    } else {
      let upPop = this.countPopAtZoom(bounds, zoom + 1, pops);
      if (upPop < popTarget) {
        return zoom;
      } else {
        return this.calculateBestZoom(bounds, zoom + 1, pops);
      }
    }
  }

  // return the number of pins in a bounded region
  private countPopAtZoom(bounds: Object, zoom: number, pops: Object): number {
    if (pops[zoom] === undefined) {
      let geoBounds = this.calculateGeoBounds(bounds, zoom);
      let geoPop = this.countResultsInBounds(geoBounds);
      pops[zoom] = geoPop;
    }
    return pops[zoom];
  }

  // determine the google lat/lng bounds of a region from a viewport and zoom
  private calculateGeoBounds(bounds: Object, zoom: number): Object {
    // at zoom 0,    256px for 180° latitude,  0.703125°/px
    //               256px for 360° longitude, 1.46025°/px
    // at zoom 1,    512px for 180° latitude,  0.3515625°/px
    //               512px for 360° longitude, 0.703125°/px
    // at zoom 2,   1024px for 180° latitude,  0.17578125°/px
    //              1024px for 360° longitude, 0.3515625°/px
    //  ...
    // at zoom n,  256*Apx for 180° latitude,  0.703125°/Apx, A = 2^n
    //            1024*Apx for 360° longitude, 1.40625°/Apx

    // vadjust compensates for the local distortion of the Mercator projection.

    let vadjust = 1.0 / Math.cos(Math.PI * bounds['lat'] / 180);
    let divisor = Math.pow(2, zoom);
    let halfHeight = vadjust * bounds['height'] / 2;
    let halfLat = 0.703125 * halfHeight / divisor;
    let halfWidth = bounds['width'] / 2;
    let halfLng = 1.406250 * halfWidth / divisor
    return {
      north: (bounds['lat'] + halfLat),
      south: (bounds['lat'] - halfLat),
      east: (bounds['lng'] + halfLng),
      west: (bounds['lng'] - halfLng)
    };
  }

  // count the pins in an area lat/lng bounded area
  private countResultsInBounds(geoBounds: Object): number {
    let counter = 0;
    for (let result of this.searchResults.pinSearchResults) {
      if ((result.address.latitude < geoBounds['north']) &&
        (result.address.latitude > geoBounds['south']) &&
        (result.address.longitude < geoBounds['east']) &&
        (result.address.longitude > geoBounds['west'])) {
        counter++;
      }
    }
    return counter;
  }

  // Converting decimal degrees into plotable degrees minutes seconds value
  private dms(dec: number): String {
    let decSgn = (dec < 0) ? "-" : "";
    dec = Math.abs(dec);
    let decDeg = parseInt("" + dec);
    let decMin = parseInt("" + (dec - decDeg) * 60.0);
    let decSec = parseInt("" + (dec - decDeg - (decMin / 60.0)) * 3600.0);
    return `${decSgn}${decDeg}° ${decMin}' ${decSec}"`;
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
    let shouldHaveMeLabel = !isPinASite && doesUserOwnPin;

    return shouldHaveMeLabel ? 'ME' : '';
  }

  public capitalizeFirstLetter(string) {

    let isStringEmptyOrNull = string === undefined || string === null || string === '';

    if (isStringEmptyOrNull) {
      return ''
    } else {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

}
