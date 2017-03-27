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
import { StateService } from '../../services/state.service';
import { UserLocationService } from  '../../services/user-location.service';
import { GoogleMapClusterDirective } from  '../../directives/google-map-cluster.directive';
import { GeoCoordinates } from '../../models/geo-coordinates';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

  @Input() searchResults: PinSearchResultsDto;

  public mapSettings: MapSettings  = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 5, false, true);

  constructor( private userLocationService: UserLocationService,
               private router: Router,
               private mapHlpr: GoogleMapService,
               private state: StateService) {}

  public ngOnInit(): void {

    let haveResults = !!this.searchResults;
    if (!haveResults) {
      // this.state.setLoading(true);
      // this.userLocationService.GetUserLocation().subscribe(
      //   pos => {
      //     this.mapSettings.zoom = 15;
      //     this.mapSettings.lat = pos.lat;
      //     this.mapSettings.lng = pos.lng;
      //   }
      // );
    } else {
      this.mapSettings.zoom = 15;
      this.mapSettings.lat = this.searchResults.centerLocation.lat;
      this.mapSettings.lng = this.searchResults.centerLocation.lng;
    }

  }

  private displayDetails(pin: Pin) {
    this.state.setCurrentView('map');
    // Both Person Pin and Gathering Pin navigate to pin-details
    // Site Pin stays on map with info-window popup
    if (pin.pinType === pinType.PERSON) {
      this.router.navigate([`person/${pin.participantId}/`]);
    } else if (pin.pinType === pinType.GATHERING){
      this.router.navigate([`gathering/${pin.gathering.groupId}/`]);
    }
  }

  public getStringByPinType(type) {
    switch (type) {
      case pinType.PERSON:
        return 'http://i.imgur.com/12l0PBc.png';
      case pinType.GATHERING:
        return 'http://i.imgur.com/8Xa3RYb.png';
      default:
        return 'http://i.imgur.com/l95VWUN.png';
    }
  }

  public getLabelName(pin: Pin) {
    return (this.getFirstNameOrSiteName(pin) + '|' + this.getLastInitial(pin) + '|' +
            this.hostOrEmptyString(pin) + '|' + this.isMe(pin) );
  }

  public getFirstNameOrSiteName(pin: Pin){
    return pin.firstName || pin.siteName;
  }

  public getLastInitial(pin: Pin){
    return pin.lastName ? (pin.lastName.substring(0, 1) + '.') : '';
  }

  public hostOrEmptyString(pin: Pin): string {
    return pin.pinType === pinType.GATHERING ? 'HOST' : '';
  }

  public isMe(pin: Pin): string {
    return '';
  }

}
