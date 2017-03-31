import { Component, HostListener, OnInit } from '@angular/core';
import { GoogleMapService } from '../../services/google-map.service';
import { GoogleMapsAPIWrapper, LatLng } from 'angular2-google-maps/core';
import { StateService } from '../../services/state.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { MapView } from '../../models/map-view';

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
              private mapHlpr: GoogleMapService,
              private state: StateService ) {
  }

  @HostListener('document:redrawingClusters', ['$event'])
  onClusterRedraw(event) {
    this.drawLabels(event.data.markersNotInClusters);
  }

  ngOnInit() {
    this.mapApiWrapper.getNativeMap()
      .then((map)=> {

        let zoomControlOptions: any = {
          style: google.maps.ControlPosition.small,
          position: google.maps.ControlPosition.LEFT_TOP
        };

        let streetViewControlOptions: any =  {
          position: google.maps.ControlPosition.RIGHT_CENTER
        };

        map.setOptions(<NativeGoogMapProps>{
          zoomControlOptions: zoomControlOptions,
          streetViewControlOptions: streetViewControlOptions,
          minZoom: 3,
          maxZoom: 20,
          scrollwheel: false,
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

        map.addListener('dragstart', function() {
          self.clearCanvas();
        });

        map.addListener("dragend", () => {
          let center = map.getCenter();
          let zoom = map.getZoom();
          let mapViewUpdate = new MapView("dragend", center.lat(), center.lng(), zoom);
          self.mapHlpr.emitMapViewUpdated(mapViewUpdate);
          self.state.setMapView(mapViewUpdate);
        });

        map.addListener("zoom_changed", () => {
          self.clearCanvas();

          let center = map.getCenter();
          let zoom = map.getZoom();
          let mapViewUpdate = new MapView("zoom_changed", center.lat(), center.lng(), zoom);
          self.mapHlpr.emitMapViewUpdated(mapViewUpdate);
          self.state.setMapView(mapViewUpdate);
        });
      });
  }

  public clearCanvas(): void {
    this.mapHlpr.emitClearMap();
  };

  public drawLabels(markers: any): void {
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

        let siteMarkers = this.mapHlpr.getSiteMarkersOnMap();
        markers.push.apply(markers, siteMarkers);

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
}
