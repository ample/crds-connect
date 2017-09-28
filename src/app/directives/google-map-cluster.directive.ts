import { Directive, AfterContentInit, QueryList, Input, ContentChildren } from '@angular/core';
import { GoogleMapsAPIWrapper, AgmMap, AgmMarker, MarkerManager } from '@agm/core';
import { GoogleMap, Marker } from '@agm/core/services/google-maps-types';

import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { GoogleMapService } from '../services/google-map.service';
import '../../scripts/markerclusterer.js';

declare const MarkerClusterer;

// An Attribute Directive that creates a MarkerClusterer in the map once the markers are loaded.
@Directive({ selector: 'google-map-cluster' })
export class GoogleMapClusterDirective implements AfterContentInit {
  private map: GoogleMap;
  private cluster;

  constructor(
    private mapHlpr: GoogleMapService,
    private wrapper: GoogleMapsAPIWrapper,
    private markerManager: MarkerManager,
  ) {}

  ngAfterContentInit() {
    this.wrapper.getNativeMap().then(map => {
      const options = {
        // maxZoom: 16, grey starts here for groups
        // maxZoom:17, grey does not seem to appear, BUT
        // all labels don't display and markers on top of each other, hard/impossible to click on individual pins
        maxZoom: 17,
        averageCenter: true,
        styles: [{
          url: '//crds-cms-uploads.s3.amazonaws.com/connect/CLUSTER.svg',
          height: 50,
          width: 50,
          textColor: '#fff'
        }]
      };

      this.cluster = new MarkerClusterer(map, this.markerManager['_markers'], options);
    });
  }
}
