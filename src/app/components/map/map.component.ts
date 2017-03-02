import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { crdsOakleyCoords } from '../../shared/constants';
import { MapSettings } from '../../models/map-settings';
import { Address } from '../../models/address';
import { Pin, pinType } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { UserLocationService } from  '../../services/user-location.service';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {
  @Input() searchResults: PinSearchResultsDto;

  public mapSettings: MapSettings  = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 15, false, true);

  constructor( private userLocationService: UserLocationService) {}

  public ngOnInit(): void {
    // TODO do we really need this? Have similar login in search-bar-component
    let haveResults = !!this.searchResults;
    if (!haveResults) {
      this.userLocationService.GetUserLocation().subscribe(
        pos => {
          this.mapSettings.lat = pos.lat;
          this.mapSettings.lng = pos.lng;
        }
      );
    } else {
      this.setMapLocation();
    }

  }

  public setMapLocation() {
      this.mapSettings.lat = this.searchResults.centerLocation.lat;
      this.mapSettings.lng = this.searchResults.centerLocation.lng;
  }

  public getStringByEnumValue(enumNumber) {
      return pinType[enumNumber];
  }


}
