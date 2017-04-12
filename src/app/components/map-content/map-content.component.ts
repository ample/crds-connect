import { Component, HostListener, OnInit } from '@angular/core';
import { GoogleMapService } from '../../services/google-map.service';
import { GoogleMapsAPIWrapper, LatLng } from 'angular2-google-maps/core';
import { StateService } from '../../services/state.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { MapView } from '../../models/map-view';

import { googleMapStyles } from '../../shared/constants';

// This does need to be 'declare'
declare let google: any;

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
      .then((map) => {

        let zoomControlOptions: any = {
          style: google.maps.ControlPosition.small,
          position: google.maps.ControlPosition.LEFT_TOP
        };

        let streetViewControlOptions: any =  {
          position: google.maps.ControlPosition.RIGHT_CENTER
        };

        map.setOptions(<NativeGoogMapProps> {
          zoomControlOptions: zoomControlOptions,
          streetViewControlOptions: streetViewControlOptions,
          minZoom: 3,
          maxZoom: 20,
          scrollwheel: false,
          styles: googleMapStyles
        });

        let self = this;

        map.addListener('dragstart', function() {
          self.clearCanvas();
        });

        map.addListener('dragend', () => {
          let center = map.getCenter();
          let zoom = map.getZoom();
          let mapViewUpdate = new MapView('dragend', center.lat(), center.lng(), zoom);
          self.mapHlpr.emitMapViewUpdated(mapViewUpdate);
          self.state.setMapView(mapViewUpdate);
        });

        map.addListener('zoom_changed', () => {
          self.clearCanvas();

          let center = map.getCenter();
          let zoom = map.getZoom();
          let mapViewUpdate = new MapView('zoom_changed', center.lat(), center.lng(), zoom);
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
      .then((map) => {

        let delta = function (a, b) { return a - b; };

        let geoBounds = undefined;

        let bounds = map.getBounds();

        if ( bounds ) {
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

        if (markers.length > 0) {
          for (let i = 0; i < markers.length; i++ ) {
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

          //------------------------------------------------------------------------------------------------------------
          let overlay;
          USGSOverlay.prototype = new google.maps.OverlayView();


          // var swBound = new google.maps.LatLng(40.73660837340877, -74.01852328);
          // var neBound = new google.maps.LatLng(40.75214181, -73.9966151);

          var swBound = new google.maps.LatLng(35.73660837340877, -79.01852328);
          var neBound = new google.maps.LatLng(40.75214181, -73.9966151);


          var mapBounds = new google.maps.LatLngBounds(swBound, neBound);

          var srcImage = 'https://developer.chrome.com/extensions/examples/api/idle/idle_simple/sample-128.png';

          console.log('Drawing overlay');
          // overlay = new USGSOverlay(mapBounds, srcImage, map, 'label');
          // overlay = new USGSOverlay(mapBounds, 'http://inspectiondoc.com/wp-content/uploads/2014/08/sample-icon.png', map, 'label');

          for(var i = 0; i<dataForDrawing.markers.length; i++) {
            console.log('Drawing individual markers');
            let marker: any = dataForDrawing.markers[i];
            // var swBound2 = new google.maps.LatLng(35.73660837340877, -79.01852328);
            // var neBound2 = new google.maps.LatLng(40.75214181, -73.9966151);
            // let swBound2 = new google.maps.LatLng(34.16382400, -89.45343200);
            // let neBound2 = new google.maps.LatLng(39.16382400, -84.45343200);
            console.log(marker.markerLat);
            console.log(marker.markerLng);
            let neBound2 = new google.maps.LatLng((marker.markerLat +.01), (marker.markerLng+.01));
            let swBound2 = new google.maps.LatLng((marker.markerLat-.01), (marker.markerLng-.01));
            let mapBounds2: any = new google.maps.LatLngBounds(swBound2, neBound2);
            overlay = new USGSOverlay(mapBounds2, 'http://inspectiondoc.com/wp-content/uploads/2014/08/sample-icon.png', map, 'label');
            console.log('Drawing overlay');
          }

            /** @constructor */
            function USGSOverlay(bounds, image, map, label) {
                // Initialize all properties.
                this.bounds_ = bounds;
                this.image_ = image;
                this.map_ = map;
                this.label_ = label;

                // Define a property to hold the image's div. We'll
                // actually create this div upon receipt of the onAdd()
                // method so we'll leave it null for now.
                this.div_ = null;

                // Explicitly call setMap on this overlay.
                this.setMap(map);
            }

            /**
             * onAdd is called when the map's panes are ready and the overlay has been
             * added to the map.
             */
            USGSOverlay.prototype.onAdd = function() {

                var div = document.createElement('div');
                div.style.borderStyle = 'none';
                div.style.borderWidth = '0px';
                div.style.position = 'absolute';

                // Create the img element and attach it to the div.
                var img = document.createElement('img');
                img.src = this.image_;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.position = 'absolute';
                div.appendChild(img);

                this.div_ = div;

                // Add the element to the "overlayLayer" pane.
                var panes = this.getPanes();
                panes.overlayLayer.appendChild(div);
            };

            USGSOverlay.prototype.draw = function() {
                var overlayProjection = this.getProjection();
                var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
                var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
                var div = this.div_;
                div.style.left = sw.x + 'px';
                div.style.top = ne.y + 'px';
                div.style.width = (ne.x - sw.x) + 'px';
                div.style.height = (sw.y - ne.y) + 'px';
            };

            // The onRemove() method will be called automatically from the API if
            // we ever set the overlay's map property to 'null'.
            USGSOverlay.prototype.onRemove = function() {
                this.div_.parentNode.removeChild(this.div_);
                this.div_ = null;
            };


            //------------------------------------------------------------------------------------------------------------

          this.mapHlpr.emitDataForDrawing(dataForDrawing);
        }
    });
  }
}
