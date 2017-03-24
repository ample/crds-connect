import { Component, HostListener, OnInit } from '@angular/core';
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

  public dataFromEventListener: undefined;

  constructor(public mapApiWrapper: GoogleMapsAPIWrapper,
              private mapHlpr: GoogleMapService ) {

    // document.addEventListener('redrawingClusters', function(event) {
    //   console.log('Clusters being redrawn');
    //   console.log(event.data);
    //   this.test();
    // });

    mapHlpr.mapUpdatedEmitter.subscribe(coords => {
      this.refreshMapSize(coords);
    });
  }

  @HostListener('document:redrawingClusters', ['$event'])
  onClusterRedraw(event) {
    this.drawLabels2(event.data.markersNotInClusters);
  }

  ngOnInit() {
    //this.test();
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
          streetViewControlOptions: streetViewControlOptions,
          styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#f5f5f5"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#bdbdbd"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#eeeeee"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e5e5e5"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dadada"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e5e5e5"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#eeeeee"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#c9c9c9"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            }
          ]
        });

        let self = this;

        //console.log('DRAW LABELS');
        //self.drawLabels();
        //console.log('//DRAW LABELS');

        map.addListener('zoom_changed', function() {
          //console.log('Zoom changed');
          self.clearCanvas();
          //self.drawLabels();
        });

        map.addListener('dragstart', function() {
          //console.log('DRAG START');
          self.clearCanvas();
        });
        //
        // map.addListener('dragend', function() {
        //   //console.log('DRAG END');
        //   self.drawLabels();
        // });

      });
  }

  public clearCanvas(): void {
    //console.log('Drawing some labels');
    this.mapApiWrapper.getNativeMap()
      .then((map)=> {
        this.mapHlpr.emitClearMap();
      });
  };

  public drawLabels(): void {
    //console.log('Drawing some labels');
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
            /*console.log(
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
              ' (' + 100.0 * dataForDrawing.markers[i].markerGeoOffsetLatPercentage + '%)');*/
          }

          this.mapHlpr.emitDataForDrawing(dataForDrawing);
     }
    });
  }

  public drawLabels2(markers: any): void {
    //console.log('Drawing some labels');
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

        let markerArray = [];

        if( markers.length > 0 ) {
          for (let i = 0; i < markers.length; i++ ){
            let marker = markers[i];
            let markerLabel = marker.title;
            let markerLat = marker.position.lat().valueOf();
            let markerLng = marker.position.lng().valueOf();
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
              markerGeoOffsetLngPercentage: markerGeoOffsetLngPercentage,
              icon: marker.icon
            };

            markerArray.push(markerObj);
          }

          let dataForDrawing = {
            geoBounds: geoBounds,
            markers: markerArray
          };

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
