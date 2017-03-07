import { Directive, AfterContentInit, QueryList, Input, ContentChildren } from '@angular/core';
import { GoogleMapsAPIWrapper, SebmGoogleMap, SebmGoogleMapMarker } from 'angular2-google-maps/core';
import { GoogleMap, Marker } from 'angular2-google-maps/core/services/google-maps-types';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { Observable } from 'rxjs';

declare const MarkerClusterer;

// An Attribute Directive that creates a MarkerClusterer in the map once the markers are loaded.

@Directive({ selector: 'google-map-cluster' })
export class GoogleMapClusterDirective implements AfterContentInit {
  private map: GoogleMap;
  private cluster;
  @ContentChildren(SebmGoogleMap) markers:QueryList<SebmGoogleMapMarker>;

  constructor(private wrapper: GoogleMapsAPIWrapper) {}

  ngAfterContentInit() {
    this.wrapper.getNativeMap().then(map => {
      let options = { maxZoom: 13 };
      this.cluster = new MarkerClusterer(map, this.markers, options);
    })
  }
}
