import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { GoogleMapService } from '../../services/google-map.service';
import { SearchService } from '../../services/search.service';
import { StateService } from '../../services/state.service';

import { GeoCoordinates } from '../../models/geo-coordinates';

@Component({
  selector: 'search-local',
  templateUrl: 'search-local.component.html'
})
export class SearchLocalComponent implements OnInit {

  private mapView;
  public active: boolean;
  public needed: boolean;

  constructor(public mapHelper: GoogleMapService,
    private state: StateService,
    public search: SearchService,
    private angulartics2: Angulartics2) {
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
    this.angulartics2.eventTrack.next({ action: 'Update Results Button Click', properties: { category: 'Connect' } });
    this.state.myStuffActive = false;
    this.search.emitLocalSearch(this.mapView);
  }
}
