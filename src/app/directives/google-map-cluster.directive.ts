import { Directive, AfterContentInit, QueryList, Input, ContentChildren } from '@angular/core';
import { GoogleMapsAPIWrapper, MarkerManager } from '@agm/core';
import { GoogleMap, Marker } from '@agm/core/services/google-maps-types';

import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { GoogleMapService } from '../services/google-map.service';
import '../../scripts/markerclusterer.js';

declare const MarkerClusterer;

interface IMarkerManager {
 _markers?: any;
  next(): any;
}

interface IObjectWithIcon {
  icon?: any;
}

// MarkerManager.prototype.markerKeys = function() { return this._markers.keys(); }

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
      let options = {
        averageCenter: true,
        styles: [{
          url: '//crds-cms-uploads.s3.amazonaws.com/connect/CLUSTER.svg',
          height: 50,
          width: 50,
          textColor: '#fff'
        }]
      };
      let sebmMarkers = <IMarkerManager>this.markerManager['_markers'].keys(); // markerKeys();
      let markers = [];
      let siteMarkers = [];
      let promises = [];
      let sebmMarker;


      while (!(sebmMarker = sebmMarkers.next()).done) {
        sebmMarker = sebmMarker.value;
        let promise = this.markerManager.getNativeMarker(sebmMarker);
        promises.push(promise);
        promise.then(marker => {
          markers.push(marker);
        });
      }

      Promise.all(promises).then(() => {
        this.cluster = new MarkerClusterer(map, markers, options);
      });

    });
  }
}
