import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { GoogleMapService } from '../../services/google-map.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { crdsOakleyCoords } from '../../shared/constants';
import { MapSettings } from '../../models/map-settings';
import { APIService } from '../../services/api.service';
import { Address } from '../../models/address';
import { Pin, pinType } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { StateService } from '../../services/state.service';
import { UserLocationService } from  '../../services/user-location.service';
import { GoogleMapClusterDirective } from  '../../directives/google-map-cluster.directive';
import {GeoCoordinates} from "../../models/geo-coordinates";

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

  @Input() searchResults: PinSearchResultsDto;

  public mapSettings: MapSettings  = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 5, false, true);

  constructor( private userLocationService: UserLocationService,
               private api: APIService,
               private router: Router,
               private mapHlpr: GoogleMapService,
               private state: StateService) {}

  public ngOnInit(): void {

    let haveResults = !!this.searchResults;
    if (!haveResults) {
      this.state.setLoading(true);
      this.userLocationService.GetUserLocation().subscribe(
        pos => {
          this.api.getPinsAddressSearchResults('placeholder', pos.lat, pos.lng).subscribe(
            pinSearchResults => {
              let results: PinSearchResultsDto = pinSearchResults as PinSearchResultsDto;
              this.searchResults = results;
              this.mapSettings.zoom = 15;
              this.mapSettings.lat = pos.lat;
              this.mapSettings.lng = pos.lng;
              this.state.setLoading(false);
              this.mapHlpr.emitRefreshMap(new GeoCoordinates(pos.lat, pos.lng));
          });
        }
      );
    } else {
      this.mapSettings.zoom = 15;
      this.setMapLocation();
    }

  }

  private displayDetails(pin: Pin) {
    // Both Person Pin and Gathering Pin navigate to pin-details
    // Site Pin stays on map with info-window popup
    if (pin.pinType === pinType.PERSON || pin.pinType === pinType.GATHERING) {
      this.router.navigate([`pin-details/${pin.participantId}/`]);
    }
  }

  public setMapLocation() {
    this.mapSettings.lat = this.searchResults.centerLocation.lat;
    this.mapSettings.lng = this.searchResults.centerLocation.lng;
  }

  public getStringByPinType(type) {
    switch (type) {
      case pinType.PERSON:
        return 'https://image.ibb.co/ebF9rF/PERSON.png';
      case pinType.GATHERING:
        return 'https://image.ibb.co/kpYJka/GATHERING.png';
      default:
        return 'https://image.ibb.co/di5Lyv/SITE.png';
    }
  }

}
