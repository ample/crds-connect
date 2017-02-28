import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { UserLocationService } from  '../../services/user-location.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';

@Component({
  selector: 'app-search-bar',
  templateUrl: 'search-bar.component.html',
  styleUrls: ['search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Input() buttontext;
  @Output() viewMap: EventEmitter<boolean>  = new EventEmitter<boolean>();
  // @Output() search: EventEmitter<string> = new EventEmitter<string>();

  private mapViewActive: boolean = true;
  private searchText: string = '';
  public pinSearchResults: PinSearchResultsDto;

  constructor(private userLocationService: UserLocationService) {}

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

  public toggleView() {
    this.buttontext = 'toggle';
    this.mapViewActive = !this.mapViewActive;
    this.viewMap.emit(this.mapViewActive);

    if (this.searchText.length > 0) {
      this.onSearch(this.searchText);
    }
  }

  public onSearch(searchString: string) {
    // this.search.emit(this.searchText);
    // this.searchText = '';
    console.log(searchString);  // undefined

    let mockApiCall = new Observable(observer => {
      let rand = Math.random();
      let pins: Pin[];
      this.pinSearchResults = new PinSearchResultsDto(new GeoCoordinates(39.9611800, -82.9987900), pins);
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
        // mapComponent.setMapLocation();
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
