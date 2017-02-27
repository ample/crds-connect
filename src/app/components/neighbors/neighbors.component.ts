import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';

import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';
import { GeoCoordinates } from '../../models/geo-coordinates';

import { crdsOakleyCoords } from '../../shared/constants';

@Component({
  selector: 'app-neighbors',
  templateUrl: 'neighbors.component.html'
})

export class NeighborsComponent {
 public mapViewActive: boolean = true;
 public pinSearchResults: PinSearchResultsDto;

  constructor(private api: APIService, private router: Router ) {}

  viewChanged(agreed: boolean) {
    this.mapViewActive = agreed;
  }

  doSearch(searchString: string) {
    console.log(searchString);

    let mockApiCall = new Observable(observer => {
      let rand = Math.random();
      let pins: Pin[];
      this.pinSearchResults = new PinSearchResultsDto(new GeoCoordinates(26.1844000, 91.7458000), pins);
      setTimeout(() => {
        if (rand > .5) {
          observer.next(this.pinSearchResults);
        } else {
          observer.error('Error!');
        }
      }, 3000)
    });

    mockApiCall.subscribe(
      next => {
        console.log(next);
        // output this to the app-map child component
          // public mapSettings: MapSettings  = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 15, false, true);
        // this.pinSearchResults.centerLocation.lat;
        // this.pinSearchResults.centerLocation.lng;
      },
      err => console.log(err)
      );

    // this.api.getPinsAddressSearchResults(searchString).subscribe(
    //   pins => {
    //   this.pinSearchResults = pins;
    //   },
    //   err => {
    //     console.log('error getting search results');
    //   }
    // );      
  }
}
