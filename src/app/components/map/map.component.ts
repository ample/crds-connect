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

  // public mockAddPerson: Address = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', -84.423363, 39.158398);
  // public mockAddHost: Address = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', -84.424363, 39.158498);
  // public mockAddBuilding: Address = new Address(123, 'Test St', null, 'TesVille', 'ZZ', '12345', -84.422363, 39.158398);

  // public pins: Array<Pin> = [
  //   new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 222,this.mockAddPerson, 0, null, 9999, true, '', pinType.PERSON),
  //   new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 222,this.mockAddHost, 0, null, 9999, true, '', pinType.GATHERING),
  //   new Pin('Bob', 'Smith', 'bobby@bob.com', 111, 222,this.mockAddBuilding, 0, null, 9999, true, '', pinType.SITE)
  // ];



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
