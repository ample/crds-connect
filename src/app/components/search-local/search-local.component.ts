import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { GoogleMapService } from '../../services/google-map.service';
import { SearchLocalService } from '../../services/search-local.service';

import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { GeoCoordinates } from '../../models/geo-coordinates';

@Component({
  selector: 'search-local',
  templateUrl: 'search-local.component.html'
})
export class SearchLocalComponent implements OnInit {

  private mapView;
  public active: boolean;

  constructor(public mapApiWrapper: GoogleMapsAPIWrapper,
              public mapHelper: GoogleMapService,
              public searchLocal: SearchLocalService) {
    mapHelper.mapViewUpdatedEmitter.subscribe((update) => {
      if ((update.value === 'dragend') || (update.value === 'zoom_changed')) {
        this.mapView = update;
        this.showButton();
      }
    });
  }

  ngOnInit() {
    this.active = false;
  }

  public showButton() {
    this.active = true;
  }

  public doLocalSearch() {
    this.searchLocal.emitLocalSearch(this.mapView);
  }
}
