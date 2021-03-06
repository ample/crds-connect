import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AnalyticsService } from '../../services/analytics.service';
import { GoogleMapService } from '../../services/google-map.service';
import { SearchService } from '../../services/search.service';
import { StateService } from '../../services/state.service';

import { GeoCoordinates } from '../../models/geo-coordinates';

@Component({
  selector: 'search-local',
  templateUrl: 'search-local.component.html'
})
export class SearchLocalComponent implements OnInit {

  public active: boolean;
  public needed: boolean;
  private mapView;

  constructor(public mapHelper: GoogleMapService,
    private state: StateService,
    public search: SearchService,
    private analytics: AnalyticsService) {
  }

  ngOnInit() {
    this.active = false;
    this.needed = false;
    this.mapHelper.mapViewUpdatedEmitter.subscribe((update) => {
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
