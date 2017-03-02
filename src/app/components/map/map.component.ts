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

            //todo: Backend needs to take EITHER a string or a set of geo-coords so that address below can be replaced
            this.api.getPinsAddressSearchResults('8683 Totempole dr Cincinnati OH 45249').subscribe(
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
        return 'http://i65.tinypic.com/7149lc.jpg';
      } else if (enumNumber === pinType.GATHERING) {
        return 'http://i65.tinypic.com/qyvldt.jpg';
      } else {
        return 'http://i65.tinypic.com/5mz2bc.jpg';
      }

      // add this back in when images are better...
       // return pinType[enumNumber];
  }
}
