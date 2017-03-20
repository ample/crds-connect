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

          if( map.getBounds() ) {

            geoBounds = {
              left: map.getBounds().getSouthWest().lat().valueOf(),
              right: map.getBounds().getNorthEast().lat().valueOf(),
              top: map.getBounds().getNorthEast().lng().valueOf(),
              bottom: map.getBounds().getSouthWest().lng().valueOf(),
              height: delta(map.getBounds().getNorthEast().lng().valueOf(), map.getBounds().getSouthWest().lng().valueOf()),
              width: Math.abs(map.getBounds().getSouthWest().lat().valueOf() - map.getBounds().getNorthEast().lat().valueOf()) //delta(map.getBounds().getSouthWest().lat().valueOf(), map.getBounds().getNorthEast().lat().valueOf())
            };

          }

          var googleMapContent = document.getElementsByClassName("sebm-google-map-content")[0];
          var markerList = googleMapContent.getElementsByTagName("sebm-google-map-marker");

          var markerArray = [];


          if( markerList.length > 0 ) {
            for (var i = 0; i < markerList.length; i++ ){
              var marker = markerList[i];
              var markerLabel = marker.getAttribute("ng-reflect-label");
              var markerLat = marker.getAttribute("ng-reflect-latitude");
              var markerLng  = marker.getAttribute("ng-reflect-longitude");
              var deltaLeftSideOfMapToMarker = delta(geoBounds.left, markerLat);
              var deltaTopOfMapToMarker = delta(geoBounds.top, markerLng);
              var markerGeoOffsetLatPercentage = deltaLeftSideOfMapToMarker / geoBounds.width;
              var markerGeoOffsetLngPercentage = deltaTopOfMapToMarker / geoBounds.height;

                var markerObj = {
                markerLabel: markerLabel,
                markerLat: markerLat,
                markerLng: markerLng,
                markerOffsetX: deltaLeftSideOfMapToMarker,
                markerOffsetY: deltaTopOfMapToMarker,
                markerGeoOffsetLatPercentage: markerGeoOffsetLatPercentage,
                markerGeoOffsetLngPercentage: markerGeoOffsetLngPercentage
              };

              markerArray.push(markerObj);
            }

            var dataForDrawing = {
              geoBounds: geoBounds,
              markers: [markerArray[4]]//markerArray
            };

            console.log('MAP WIDTH: ' + geoBounds.width + ' MAP HEIGHT: ' +  geoBounds.height);
            console.log('Marker distance left: ' +  dataForDrawing.markers[0].markerOffsetX + ' marker distance top: ' + dataForDrawing.markers[0].markerOffsetY);

            for(var i = 0; i < dataForDrawing.markers.length; i++) {
              console.log('Lat offset %: ' + dataForDrawing.markers[i].markerGeoOffsetLatPercentage + ' lang offset %: ' + dataForDrawing.markers[i].markerGeoOffsetLngPercentage);
            }

            this.mapHlpr.emitDataForDrawing(dataForDrawing);
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