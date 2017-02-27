import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';

import { PinSearchResultsDto } from '../../models/pin-search-results-dto';

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

    // this.api.getPinsAddressSearchResults(searchString).subscribe(
    //   pins => {
    //   this.pinSearchResults = pins;
    //   },
    //   err => {
    //     console.log('error getting search results');
    //   }
    // );

    let mockApiCall = new Observable(observer => {
      let rand = Math.random();
      setTimeout(() => {
        if (rand > .5) {
          observer.next('Success');
        } else {
          observer.error('Error!');
        }
      }, 3000)
    });

    mockApiCall.subscribe(
      next => console.log(next),
      err => console.log(err)
      );
  }
}
