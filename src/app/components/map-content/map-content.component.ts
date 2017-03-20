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

          var delta = function (a, b) { return a - b };

          var geoBounds = undefined;

          let bounds = map.getBounds();

          if( bounds ) {
            let sw = bounds.getSouthWest();
            let ne = bounds.getNorthEast();
            geoBounds = {
              top:    sw.lat().valueOf(),
              bottom: ne.lat().valueOf(),
              left:   ne.lng().valueOf(),
              right:  sw.lng().valueOf(),
              width:  delta(ne.lng().valueOf(), sw.lng().valueOf()),
              height: delta(sw.lat().valueOf(), ne.lat().valueOf())
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
              var markerLng = marker.getAttribute("ng-reflect-longitude");
              var deltaLeftSideOfMapToMarker = delta(markerLng, geoBounds.right);
              var deltaTopOfMapToMarker = delta(markerLat, geoBounds.bottom);
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
              markers: markerArray
            };

            for(var i = 0; i < dataForDrawing.markers.length; i++) {
              console.log(
                ' geo delta left: ' + dataForDrawing.markers[0].markerOffsetX);
              console.log(
                ' geo width:  ' + geoBounds.width +
                ' (' + geoBounds.left + ', ' + geoBounds.right + ')');
              console.log(
                ' Lng offset ' + dataForDrawing.markers[i].markerLng +
                ' (' + 100.0 * dataForDrawing.markers[i].markerGeoOffsetLngPercentage + '%)');
              console.log(
                ' geo delta top:  ' + dataForDrawing.markers[0].markerOffsetY);
              console.log(
                ' geo height: ' + geoBounds.height +
                ' (' + geoBounds.top + ', ' + geoBounds.bottom + ')');
              console.log(
                ' Lat offset ' + dataForDrawing.markers[i].markerLat +
                ' (' + 100.0 * dataForDrawing.markers[i].markerGeoOffsetLatPercentage + '%)');
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
