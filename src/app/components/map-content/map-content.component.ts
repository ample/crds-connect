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

          var geoBounds = undefined;
          var elmBounds = undefined;

          var ngGoogleMap = document.getElementsByClassName("sebm-google-map-container")[0];
          //console.log(ngGoogleMap);
          //console.log('BOUNDING RECTANGLE: ');
          console.log(ngGoogleMap.getBoundingClientRect());
          //console.log('MAP CENTER: ');
          var mapCenter = map.getCenter();
          //console.log(mapCenter);
          // console.log(mapCenter.lat().valueOf());
          //console.log(mapCenter.lng().valueOf());
          //console.log('BOUNDS: ');
          //console.log(map.getBounds());

          // if( map.getBounds() ) {
          //
          //   console.log( map.getBounds().getNorthEast().lat().valueOf() );
          //   console.log( map.getBounds().getNorthEast().lng().valueOf() );
          //   console.log( map.getBounds().getSouthWest().lat().valueOf() );
          //   console.log( map.getBounds().getSouthWest().lng().valueOf() );
          //
          //   geoBounds = {
          //     topLeft: { lat: map.getBounds().getSouthWest().lat().valueOf(), lng: map.getBounds().getNorthEast().lng().valueOf() },
          //     topRight: { lat: map.getBounds().getNorthEast().lat().valueOf(), lng: map.getBounds().getNorthEast().lng().valueOf()},
          //     bottomLeft: {lat: map.getBounds().getSouthWest().lat().valueOf(), lng: map.getBounds().getSouthWest().lng().valueOf() },
          //     bottomRight: {lat: map.getBounds().getNorthEast().lat().valueOf(), lng: map.getBounds().getSouthWest().lng().valueOf() },
          //   };
          //
          //   console.log('GEO BOUNDS: ');
          //   console.log(geoBounds);
          //
          // }

          // var googleMapContent = document.getElementsByClassName("sebm-google-map-content")[0];
          // console.log(googleMapContent);
          //
          // var markerList = googleMapContent.getElementsByTagName("sebm-google-map-marker");
          // console.log(markerList[0] ? markerList[0] : []);
          //
          // if( markerList.length > 0 ) {
          //     for (var i = 0; i < markerList.length; i++ ){
          //        var marker = markerList[i];
          //        var markerLabel = marker.getAttribute("ng-reflect-label");
          //        var markerLat = marker.getAttribute("ng-marker-latitude");
          //        var markerLng  = marker.getAttribute("ng-marker-longitude");
          //     }
          // }

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