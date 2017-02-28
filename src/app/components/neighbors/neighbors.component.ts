import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';
import { UserLocationService } from  '../../services/user-location.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';

import { crdsOakleyCoords } from '../../shared/constants';

@Component({
  selector: 'app-neighbors',
  templateUrl: 'neighbors.component.html'
})

export class NeighborsComponent implements OnInit {
 public mapViewActive: boolean = true;
 public pinSearchResults: PinSearchResultsDto;

  constructor(private api: APIService, private router: Router, private userLocationService: UserLocationService ) {}

  public ngOnInit(): void {
    let haveResults = !!this.pinSearchResults;
    if (!haveResults) {
      this.userLocationService.GetUserLocation().subscribe(
        pos => {
          this.pinSearchResults = new PinSearchResultsDto(new GeoCoordinates(pos.lat, pos.lng), new Array<Pin>());
        }
      );
    }
  }

  viewChanged(agreed: boolean) {
    this.mapViewActive = agreed;
  }

  doSearch(searchString: string) {
    console.log(searchString);

    let mockApiCall = new Observable(observer => {
      let rand = Math.random();
      let pins: Pin[];
      setTimeout(() => {
        if (rand > .5) {
          observer.next(new PinSearchResultsDto(new GeoCoordinates(39.9611800, -82.9987900), pins));
        } else {
          observer.error('Error!');
        }
      }, 3000)
    });

    mockApiCall.subscribe(
      next => {
        console.log(next);
        this.pinSearchResults = next as PinSearchResultsDto;
      },
      err => console.log(err)
      );

    // this.api.getPinsAddressSearchResults(searchString).subscribe(
    //   pins => {
    //   this.pinSearchResults = next as PinSearchResultsDto;
    //   },
    //   err => {
    //     console.log('error getting search results');
    //   }
    // );      
  }
}
