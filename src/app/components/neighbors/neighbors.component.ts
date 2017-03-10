import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';
import { GoogleMapService } from '../../services/google-map.service';
import { StateService } from '../../services/state.service';
import { UserLocationService } from  '../../services/user-location.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';

@Component({
  selector: 'app-neighbors',
  templateUrl: 'neighbors.component.html'
})

export class NeighborsComponent implements OnInit {
  public mapViewActive: boolean = true;
  public pinSearchResults: PinSearchResultsDto;

  constructor(private api: APIService,
              private mapHlpr: GoogleMapService,
              private router: Router,
              private state: StateService,
              private userLocationService: UserLocationService) {}

  public ngOnInit(): void {
    let haveResults = !!this.pinSearchResults;
    if (!haveResults) {
      this.state.setLoading(true);
      this.userLocationService.GetUserLocation().subscribe(
        pos => {
          this.pinSearchResults = new PinSearchResultsDto(new GeoCoordinates(pos.lat, pos.lng), new Array<Pin>());
          this.doSearch('useLatLng', pos.lat, pos.lng );
        }
      );
    }
  }

  viewChanged(agreed: boolean) {
    this.mapViewActive = agreed;
  }

  doSearch(searchString: string, lat?: number, lng?: number) {
    this.state.setLoading(true);
    this.api.getPinsAddressSearchResults(searchString, lat, lng).subscribe(
      next => {
        console.log(next);
        this.pinSearchResults = next as PinSearchResultsDto;
        this.state.setLoading(false);
        this.mapHlpr.emitRefreshMap(this.pinSearchResults.centerLocation);
      },
      error => {
        console.log(error);
      });
  }

}
