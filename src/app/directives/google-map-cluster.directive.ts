import { Directive, AfterContentInit, QueryList, Input, ContentChildren } from '@angular/core';
import { GoogleMapsAPIWrapper, SebmGoogleMap, SebmGoogleMapMarker, MarkerManager } from 'angular2-google-maps/core';
import { GoogleMap, Marker } from 'angular2-google-maps/core/services/google-maps-types';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import '../../scripts/markerclusterer.js'

declare const MarkerClusterer;

interface IMarkerManager {
 _markers?: any;
  next(): any;
}
//MarkerManager.prototype.markerKeys = function() { return this._markers.keys(); }

// An Attribute Directive that creates a MarkerClusterer in the map once the markers are loaded.

@Directive({ selector: 'google-map-cluster' })
export class GoogleMapClusterDirective implements AfterContentInit {
  private map: GoogleMap;
  private cluster;

  constructor(
    private wrapper: GoogleMapsAPIWrapper,
    private markerManager: MarkerManager,
  ) {}

  ngAfterContentInit() {
    this.wrapper.getNativeMap().then(map => {
      let clusterStyle = [{
        url: '/assets/CLUSTER.png',
        height: 53,
        width: 53,
        textColor: '#fff'
      }];
      let options = {
        averageCenter: true,
        imagePath: '/assets/CLUSTER',
        styles: clusterStyle
      };
      let sebmMarkers = <IMarkerManager>this.markerManager["_markers"].keys(); //markerKeys();
      let markers = [];
      let promises = [];
      let sebmMarker;
      while (!(sebmMarker = sebmMarkers.next()).done) {
        sebmMarker = sebmMarker.value;
        if (sebmMarker.iconUrl.endsWith("PERSON.png") ||
            sebmMarker.iconUrl.endsWith("GATHERING.png")) {
          let promise = this.markerManager.getNativeMarker(sebmMarker)
          promises.push(promise)
          promise.then(marker => {
            markers.push(marker);
          })
        }
      }
      Promise.all(promises).then(() => {
        this.cluster = new MarkerClusterer(map, markers, options);
      })
    })
  }
}
