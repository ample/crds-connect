import { Angulartics2 } from 'angulartics2';

import { Component, HostListener, OnInit } from '@angular/core';
import { GoogleMapService } from '../../services/google-map.service';
import { GoogleMapsAPIWrapper, LatLng } from 'angular2-google-maps/core';
import { StateService } from '../../services/state.service';
import { AppSettingsService } from '../../services/app-settings.service';

import { GeoCoordinates } from '../../models/geo-coordinates';
import { MapView } from '../../models/map-view';
import { MapGeoBounds } from '../../models/map-geo-bounds';

import { MapMarker } from '../../models/map-marker';
import { PinLabelData, PinLabel } from '../../models/pin-label-data';
import { pinType } from '../../models/pin';

import { app, App, googleMapStyles } from '../../shared/constants';

/** @Overlay Constructor */
function PinLabelOverlay(bounds, map, labelData) {
    this.bounds_ = bounds;
    this.map_ = map;
    this.labelData_ = labelData;

    this.div_ = null;

    this.setMap(map);
}

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

  public areLabelsInitialized: boolean = false;
  public dataFromEventListener: undefined;
  public markersOutsideOfClustersCount: number = undefined;
  public overlay: any = undefined;

  constructor(public mapApiWrapper: GoogleMapsAPIWrapper,
              private mapHlpr: GoogleMapService,
              private state: StateService,
              private appSettings: AppSettingsService ) {
  }

  @HostListener('document:redrawingClusters', ['$event'])
  onClusterRedraw(event) {
    if (this.appSettings.isConnectApp()) {
      this.drawLabels(event.data.markersNotInClusters);
    }
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
          styles: googleMapStyles,
          fullscreenControl: false
        });

          let self = this;

          map.addListener('dragend', () => {
            let center = map.getCenter();
            let zoom = map.getZoom();
            let mapViewUpdate = new MapView('dragend', center.lat(), center.lng(), zoom);
            self.mapHlpr.emitMapViewUpdated(mapViewUpdate);
            self.state.setMapView(mapViewUpdate);
          });

          map.addListener('zoom_changed', () => {
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

          PinLabelOverlay.prototype = new google.maps.OverlayView();

          let mapRdyAndMarkersReclustered: boolean = this.overlay && this.didNonSiteMarkerCountChange(markers.length);

          if (mapRdyAndMarkersReclustered) {
            this.overlay.setMap(null);
          }

          let labelsNotDrawnAfterReclusterOrInit: boolean = !this.areLabelsInitialized || mapRdyAndMarkersReclustered;

          if (labelsNotDrawnAfterReclusterOrInit) {
            for (let i = 0; i < dataForDrawing.markers.length; i++) {

              let marker: any = dataForDrawing.markers[i];
              let labelData: PinLabelData = JSON.parse(marker.markerLabel);

              let markerLabelProps: PinLabel = new PinLabel(labelData);

              labelData.pinLabel = markerLabelProps;

              let neBound: any = new google.maps.LatLng(marker.markerLat, marker.markerLng);
              let swBound: any = new google.maps.LatLng(marker.markerLat, marker.markerLng);
              let mapBounds: any = new google.maps.LatLngBounds(swBound, neBound);
              this.overlay = new PinLabelOverlay(mapBounds, map, labelData);

              this.areLabelsInitialized = true;
            }
          }

          PinLabelOverlay.prototype.onAdd = function() {

            let div = document.createElement('div');
            div.innerHTML = this.labelData_.pinLabel.allTextWLineBreak;
            div.style.borderStyle = 'none';
            div.style.borderWidth = '0px';
            div.style.position = 'absolute';

            this.div_ = div;

            // Add the element to the "overlayLayer" pane.
            let panes = this.getPanes();
            panes.overlayLayer.appendChild(div);
          };

          PinLabelOverlay.prototype.draw = function() {
            let overlayProjection = this.getProjection();
            let sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
            let ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());
            let div = this.div_;
            div.className = 'pin-label';
            div.className += ' ' + pinType[this.labelData_.pinType].toLowerCase().toString();
            if (this.labelData_.isMe) {
               div.className += ' me';
           } else {
              if (this.labelData_.isHost) { div.className += ' host'; }
            }
            div.style.left = sw.x + 20 + 'px';
            div.style.top = ne.y - 20 + 'px';
            div.style.width = ((ne.x - sw.x) + 100) + 'px';
            div.style.height = (sw.y - ne.y) + 'px';
          };

          PinLabelOverlay.prototype.onRemove = function() {
            this.div_.parentNode.innerHTML = '';
          };

        }
    });
  }
}
