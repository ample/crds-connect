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

        let self = this;

        console.log('DRAW LABELS');
        self.drawLabels();
        console.log('//DRAW LABELS');

        map.addListener('zoom_changed', function() {
          console.log('Zoom changed');
          self.drawLabels();
        });

        map.addListener('dragstart', function() {
          console.log('DRAG START');
          self.clearCanvas();
        });

        map.addListener('dragend', function() {
          console.log('DRAG END');
          self.drawLabels();
        });

      });

  }

  public clearCanvas(): void {
    console.log('Drawing some labels');
    this.mapApiWrapper.getNativeMap()
      .then((map)=> {
        this.mapHlpr.emitClearMap();
      });
  };

  public drawLabels(): void {
      console.log('Drawing some labels');
      this.mapApiWrapper.getNativeMap()
          .then((map)=> {

              let delta = function (a, b) { return a - b };

              let geoBounds = undefined;

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

              let googleMapContent = document.getElementsByClassName("sebm-google-map-content")[0];
              let markerList = googleMapContent.getElementsByTagName("sebm-google-map-marker");

              let markerArray = [];


              if( markerList.length > 0 ) {
                  for (let i = 0; i < markerList.length; i++ ){
                      let marker = markerList[i];
                      let markerLabel = marker.getAttribute("ng-reflect-label");
                      let markerLat = marker.getAttribute("ng-reflect-latitude");
                      let markerLng = marker.getAttribute("ng-reflect-longitude");
                      let deltaLeftSideOfMapToMarker = delta(markerLng, geoBounds.right);
                      let deltaTopOfMapToMarker = delta(markerLat, geoBounds.bottom);
                      let markerGeoOffsetLatPercentage = deltaLeftSideOfMapToMarker / geoBounds.width;
                      let markerGeoOffsetLngPercentage = deltaTopOfMapToMarker / geoBounds.height;

                      let markerObj = {
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

                  let dataForDrawing = {
                      geoBounds: geoBounds,
                      markers: markerArray
                  };

                  for(let i = 0; i < dataForDrawing.markers.length; i++) {
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
