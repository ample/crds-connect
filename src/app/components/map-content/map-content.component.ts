import { Component, HostListener, OnInit } from '@angular/core';
import { GoogleMapService } from '../../services/google-map.service';
import { GoogleMapsAPIWrapper, LatLng } from 'angular2-google-maps/core';
import { StateService } from '../../services/state.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { MapView } from '../../models/map-view';
import { MapGeoBounds } from '../../models/map-geo-bounds';

import { MapMarker } from '../../models/map-marker';
import { PinLabelData, PinLabel } from '../../models/pin-label-data';

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

  public overlay: any = undefined;
  public dataFromEventListener: undefined;
  public markersOutsideOfClustersCount: number = undefined;

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

      });
  }

  public clearCanvas(): void {
    this.mapHlpr.emitClearMap();
  };

  public didNonSiteMarkerCountChange(newMarkerCount: number): boolean {
    let isCountChanged: boolean = newMarkerCount !== this.markersOutsideOfClustersCount;
    this.markersOutsideOfClustersCount = newMarkerCount;
    return isCountChanged;
  }

  public drawLabels(markers: any): void {
    this.mapApiWrapper.getNativeMap()
      .then((map) => {

        let delta = function (a, b) { return a - b; };

        let geoBounds: MapGeoBounds = undefined;

        let bounds = map.getBounds();

        if ( bounds ) {
          geoBounds = new MapGeoBounds(bounds, delta);
        }

        let siteMarkers = this.mapHlpr.getSiteMarkersOnMap();
        markers.push.apply(markers, siteMarkers);

        let markerArray = [];

        if (markers.length > 0) {

          for (let i = 0; i < markers.length; i++ ) {
            let marker: MapMarker = new MapMarker(markers[i], geoBounds, delta);
            markerArray.push(marker);
          }

          let dataForDrawing = {
            geoBounds: geoBounds,
            markers: markerArray
          };

          //------------------------------------------------------------------------------------------------------------
          USGSOverlay.prototype = new google.maps.OverlayView();

          let mapRdyAndMarkersReclustered = this.overlay && this.didNonSiteMarkerCountChange(markers.length);

          if (mapRdyAndMarkersReclustered) {
            this.overlay.setMap(null);
          }


          for(var i = 0; i<dataForDrawing.markers.length; i++) {

            let marker: any = dataForDrawing.markers[i];
            let labelData: PinLabelData = JSON.parse(marker.markerLabel);

            let isHostOrMe: boolean = labelData.isHost || labelData.isMe;
            let markerLabelProps: PinLabel = new PinLabel(labelData);

            let divText = markerLabelProps.line1 + '\n' + markerLabelProps.line2;

            let neBound = new google.maps.LatLng((marker.markerLat), (marker.markerLng));
            let swBound = new google.maps.LatLng((marker.markerLat), (marker.markerLng));
            let mapBounds: any = new google.maps.LatLngBounds(swBound, neBound);
            this.overlay = new USGSOverlay(mapBounds, map, divText);
          }

            /** @constructor */
            function USGSOverlay(bounds, map, label) {

                this.bounds_ = bounds;
                this.map_ = map;
                this.label_ = label;

                this.div_ = null;

                this.setMap(map);
            }

            USGSOverlay.prototype.onAdd = function() {

                var div = document.createElement('div');
                div.innerHTML = this.label_;
                div.style.borderStyle = 'none';
                div.style.borderWidth = '0px';
                div.style.position = 'absolute';

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
                div.className = 'pin-label';
                div.className += ''; //placeholder for pin type
                div.style.left = sw.x + 20 + 'px';
                div.style.top = ne.y - 20 + 'px';
                div.style.width = ((ne.x - sw.x) + 50) + 'px';
                div.style.height = (sw.y - ne.y) + 'px';
            };

            USGSOverlay.prototype.onRemove = function() {
              this.div_.parentNode.innerHTML = '';
            };

        }
    });
  }
}
