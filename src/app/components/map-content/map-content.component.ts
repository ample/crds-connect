import { Component, OnInit } from '@angular/core';
import { GoogleMapService } from '../../services/google-map.service';
import { GoogleMapsAPIWrapper } from 'angular2-google-maps/core';

import { GeoCoordinates } from '../../models/geo-coordinates';

declare let google: any; //This does need to be 'declare'

interface NativeGoogMapProps {
    zoomControlOptions?: any;
    streetViewControlOptions?: any;
}

@Component({
    selector: 'app-map-content',
    template: ''
})
export class MapContentComponent implements OnInit {

  constructor(public mapApiWrapper: GoogleMapsAPIWrapper,
              private mapHlpr: GoogleMapService ) {
    mapHlpr.mapUpdatedEmitter.subscribe(coords => {
      this.refreshMapSize(coords);
    });
  }

  ngOnInit() {
    this.mapApiWrapper.getNativeMap()
      .then((map)=> {

          var delta = function (a, b) { return Math.abs(a - b) };

          var geoBounds = undefined;
          var elmBounds = undefined;
          var geoToElmRatioHeight = undefined;
          var geoToElmRatioHeight = undefined;


          var ngGoogleMap = document.getElementsByClassName("sebm-google-map-container")[0];


          elmBounds = ngGoogleMap.getBoundingClientRect();
          console.log('BOUNDING RECTANGLE: ');
          console.log(elmBounds);


          if( map.getBounds() ) {

            geoBounds = {
              left: map.getBounds().getSouthWest().lat().valueOf(),
              right: map.getBounds().getNorthEast().lat().valueOf(),
              top: map.getBounds().getNorthEast().lng().valueOf(),
              bottom: map.getBounds().getSouthWest().lng().valueOf(),
              height: delta(map.getBounds().getNorthEast().lng().valueOf(), map.getBounds().getSouthWest().lng().valueOf()),
              width: delta(map.getBounds().getSouthWest().lat().valueOf(), map.getBounds().getNorthEast().lat().valueOf())
            };

            geoToElmRatioHeight = geoBounds.height / elmBounds.height;
            geoToElmRatioHeight = geoBounds.width / elmBounds.width;

            console.log('GEO BOUNDS: ');
            console.log(geoBounds);

          }

          var googleMapContent = document.getElementsByClassName("sebm-google-map-content")[0];
          console.log(googleMapContent);

          var markerList = googleMapContent.getElementsByTagName("sebm-google-map-marker");
          console.log(markerList[0] ? markerList[0] : []);

          var markerArray = [];

          if( markerList.length > 0 ) {
            for (var i = 0; i < markerList.length; i++ ){
              var marker = markerList[i];
              var markerLabel = marker.getAttribute("ng-reflect-label");
              var markerLat = marker.getAttribute("ng-marker-latitude");
              var markerLng  = marker.getAttribute("ng-marker-longitude");
            }
          }

        let zoomControlOptions: any = {
          style: google.maps.ControlPosition.small,
          position: google.maps.ControlPosition.RIGHT_CENTER
        };

        let streetViewControlOptions: any =  {
          position: google.maps.ControlPosition.RIGHT_CENTER
        };

        map.setOptions(<NativeGoogMapProps>{
          zoomControlOptions: zoomControlOptions,
          streetViewControlOptions: streetViewControlOptions
        });
      });
  }

  public refreshMapSize(coords: GeoCoordinates){
    this.mapApiWrapper.getNativeMap()
      .then((map)=> {
        setTimeout(() => {
          google.maps.event.trigger(map, "resize");
          map.setZoom(15);
          map.setCenter(coords);
        }, 1);
      })
  }
}