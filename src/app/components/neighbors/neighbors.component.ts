import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';
import { GoogleMapService } from '../../services/google-map.service';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { StateService } from '../../services/state.service';
import { UserLocationService } from  '../../services/user-location.service';
import { SearchLocalService } from  '../../services/search-local.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { MapView } from '../../models/map-view';
import { Pin } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';

@Component({
  selector: 'app-neighbors',
  templateUrl: 'neighbors.component.html'
})

export class NeighborsComponent implements OnInit {
  public isMapHidden = false;
  public mapViewActive: boolean = true;
  public pinSearchResults: PinSearchResultsDto;

  constructor(private api: APIService,
              private mapHlpr: GoogleMapService,
              private neighborsHelper: NeighborsHelperService,
              private router: Router,
              private state: StateService,
              private userLocationService: UserLocationService,
              private searchLocalService: SearchLocalService) {
    searchLocalService.doLocalSearchEmitter.subscribe((mapView: MapView) => {
      this.state.setUseZoom(mapView.zoom);
      this.doSearch('searchLocal', mapView.lat, mapView.lng);
    });
  }

  public ngOnInit(): void {
    let haveResults = !!this.pinSearchResults;
    if (!haveResults) {
      this.state.setLoading(true);
      this.setView( this.state.getCurrentView() );
      this.userLocationService.GetUserLocation().subscribe(
        pos => {
          this.pinSearchResults = new PinSearchResultsDto(new GeoCoordinates(pos.lat, pos.lng), new Array<Pin>());
          this.doSearch('useLatLng', pos.lat, pos.lng );
        }
      );
    } else {
      this.setView( this.state.getCurrentView() );
    }
  }

  setView(mapOrListView): void {
    this.mapViewActive = mapOrListView === 'map';
  }

  viewChanged(isMapViewActive: boolean) {
    this.mapViewActive = isMapViewActive;
  }

  doSearch(searchString: string, lat?: number, lng?: number) {
    this.state.setLoading(true);
    this.api.getPinsAddressSearchResults(searchString, lat, lng).subscribe(
      next => {
        this.pinSearchResults = next as PinSearchResultsDto;

        // sort
        this.pinSearchResults.pinSearchResults =
          this.pinSearchResults.pinSearchResults.sort(
            (p1: Pin, p2: Pin) => {
              if (p1.proximity !== p2.proximity) {
                return p1.proximity - p2.proximity; // asc
              } else if (p1.firstName && p2.firstName && (p1.firstName !== p2.firstName)) {
                return p1.firstName.localeCompare(p2.firstName); // asc
              } else if (p1.lastName && p2.lastName && (p1.lastName !== p2.lastName)) {
                return p1.lastName.localeCompare(p2.lastName); // asc
              } else {
                return p2.pinType - p1.pinType; // des
              }
            }
          );

        // uniq - algorithm takes advantage of being sorted
        let lastIndex = null;
        this.pinSearchResults.pinSearchResults =
          this.pinSearchResults.pinSearchResults.filter(
            (p, index, self) => {
              if (p.pinType === 3) {
                lastIndex = -1;
                return true;
              } else if (lastIndex === -1) {
                lastIndex = index;
                return true;
              } else {
                let pl = self[lastIndex];
                let test = (p.proximity !== pl.proximity) ||
                           (p.firstName !== pl.firstName) ||
                           (p.lastName  !== pl.lastName );
                if (test) {
                  lastIndex = index;
                }
                return test;
              }
            }
          );

        this.state.setLoading(false);

        if (this.mapViewActive) {
          this.mapHlpr.emitRefreshMap(this.pinSearchResults.centerLocation);
        }

        this.neighborsHelper.emitChange();

        this.isMapHidden = true;
        setTimeout(() => {
          this.isMapHidden = false;
        }, 1);

        // if pinsearchresults is empty then display the bland page
        if ( this.pinSearchResults.pinSearchResults.length === 0) {
          this.state.setLoading(false);
          this.goToNoResultsPage();
        }
      },
      error => {
        console.log(error);
        this.state.setLoading(false);
        this.goToNoResultsPage();
      });
  }

  private goToNoResultsPage() {
    this.mapViewActive ? this.state.setCurrentView('map') : this.state.setCurrentView('list');
    this.router.navigateByUrl('/no-results');
  }

}
