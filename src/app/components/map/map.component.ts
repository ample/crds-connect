import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { crdsOakleyCoords } from '../../shared/constants';
import { MapSettings } from '../../models/map-settings';
import { APIService } from '../../services/api.service';
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

  public mapSettings: MapSettings  = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 5, false, true);

  constructor( private userLocationService: UserLocationService,
               private api: APIService) {}

  public ngOnInit(): void {

    let haveResults = !!this.searchResults;
    if (!haveResults) {
      this.userLocationService.GetUserLocation().subscribe(
        pos => {
          this.mapSettings.zoom = 15;
          this.mapSettings.lat = pos.lat;
          this.mapSettings.lng = pos.lng;
            this.api.getPinsAddressSearchResults('placeholder', pos.lat, pos.lng).subscribe(
              pinSearchResults => {
                let results: PinSearchResultsDto = pinSearchResults as PinSearchResultsDto;
                this.searchResults = results;
            },
                err => console.log(err)
            );
        }
      );
    } else {
      this.mapSettings.zoom = 15;
      this.setMapLocation();
    }

  }

  public setMapLocation() {
    this.mapSettings.lat = this.searchResults.centerLocation.lat;
    this.mapSettings.lng = this.searchResults.centerLocation.lng;
  }

  public getStringByEnumValue(enumNumber) {
      if (enumNumber === pinType.PERSON) {
        return "https://image.ibb.co/ebF9rF/PERSON.png";
      } else if (enumNumber === pinType.GATHERING) {
        return "https://image.ibb.co/kpYJka/GATHERING.png";
      } else {
        return "https://image.ibb.co/di5Lyv/SITE.png";
      }

      // add this back in when images are better...
       // return pinType[enumNumber];
  }
}
