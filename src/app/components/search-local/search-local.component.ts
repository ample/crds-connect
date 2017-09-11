import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AnalyticsService } from '../../services/analytics.service';
import { GoogleMapService } from '../../services/google-map.service';
import { SearchService } from '../../services/search.service';
import { StateService } from '../../services/state.service';

import { GeoCoordinates, MapView } from '../../models/';

@Component({
  selector: 'search-local',
  templateUrl: 'search-local.component.html'
})
export class SearchLocalComponent implements OnInit {
  private mapView: MapView;
  public active: boolean;
  public needed: boolean;

  constructor(public mapHelper: GoogleMapService,
    private state: StateService,
    public search: SearchService,
    private analytics: AnalyticsService) {
  }

  ngOnInit() {
    this.active = false;
    this.needed = false;
    this.mapHelper.mapViewUpdatedEmitter.subscribe((update: MapView) => {
      if ((update.value === 'dragend') || (update.value === 'zoom_changed')) {
        this.mapView = update;
        this.showButton();
      }
    });
  }

  public showButton() {
    this.active = true;
  }

  public doLocalSearch() {
    this.analytics.updateResultsPressed('Connect');
    this.state.myStuffActive = false;
  }
}
