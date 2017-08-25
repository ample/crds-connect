import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { GeoCoordinates, MapBoundingBox, MapView, Pin } from '../models/';
import {AppSettingsService} from './app-settings.service';
import { initialMapZoom, zoomAdjustment, minZoom, maxZoom, pinTargetGroups, pinTargetConnect } from '../shared/constants';

@Injectable()
export class GoogleMapService {
  // TODO: Should these be subjects?
  // See https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
  public mapUpdatedEmitter: EventEmitter<GeoCoordinates>;
  public mapClearEmitter: EventEmitter<void>;
  public dataForDrawingEmitter: EventEmitter<any>;
  public clusterMarkersEmitter: EventEmitter<any>;

  public didUserAllowGeoLoc: boolean = false;
  public siteMarkersOnMap: any = undefined;
  public mapViewUpdatedEmitter: EventEmitter<MapView>;

  constructor(private appSettings: AppSettingsService) {
    this.mapUpdatedEmitter = new EventEmitter<GeoCoordinates>();
    this.mapClearEmitter = new EventEmitter<void>();
    this.dataForDrawingEmitter = new EventEmitter<any>();
    this.clusterMarkersEmitter = new EventEmitter<any>();
    this.mapViewUpdatedEmitter = new EventEmitter<MapView>();
  }

  public emitRefreshMap(coords: GeoCoordinates): void {
    this.mapUpdatedEmitter.emit(coords);
  }

  public emitClearMap(): void {
    this.mapClearEmitter.emit();
  }

  public emitDataForDrawing(data: any): void {
    this.dataForDrawingEmitter.emit(data);
  }

  public emitClusterMarkerData(data: any): void {
    this.clusterMarkersEmitter.emit(data);
  }

  public setDidUserAllowGeoLoc(value: boolean): void {
    this.didUserAllowGeoLoc = value;
  }

  public emitMapViewUpdated(mapView: MapView): void {
    this.mapViewUpdatedEmitter.emit(mapView);
  }

  // get the best zoom level for the map
  public calculateZoom(zoom: number, lat: number, lng: number, pins: Pin[], viewtype: string): number {
    // Filter out online groups since they are not displayed on the map:
    pins = pins.filter((pin) => (!pin.gathering ? true : pin.gathering.availableOnline)  && pin.address.latitude && pin.address.longitude);

    const mapParams: MapView = new MapView('zoomCalcView', lat, lng, initialMapZoom);
    const popTarget = this.getPopTarget(pins, viewtype);

    return this.calculateBestZoom(mapParams, pins, popTarget, {}) - zoomAdjustment;
  }


  // Returns the target number of search results based on whether this is a connect or group app.
  private getPopTarget(pins: Pin[], viewtype: string): number {
    if (viewtype === 'world') {
      if (this.appSettings.isConnectApp()) {
        return pinTargetConnect;
      } else {
        return pinTargetGroups;
      }
    } else {
      return pins.length;
    }
  }

  // zero in on the zoom that's closest to the target pin count without going under
  private calculateBestZoom(mapParams: MapView, pins: Pin[], popTarget: number, pops: Object = {}): number {
    const pop: number = this.countPopAtZoom(mapParams, pins, pops);
    if (pop < popTarget) {
      if (mapParams.zoom <= minZoom) {
        return minZoom;
      }
      mapParams.zoom--;
      return this.calculateBestZoom(mapParams, pins, popTarget, pops);
    } else if (mapParams.zoom >= maxZoom) {
      return maxZoom;
    } else {
      mapParams.zoom++;
      const popAfterZoomIn = this.countPopAtZoom(mapParams, pins, pops);
      if (popAfterZoomIn < popTarget) {
        return mapParams.zoom - 1;  // Undo the zoom if it causes us to go below the popTarget
      } else {
        mapParams.zoom++;
        return this.calculateBestZoom(mapParams, pins, popTarget, pops);
      }
    }
  }

  // return the number of pins in a bounded region
  private countPopAtZoom(mapParams: MapView, pins: Pin[], pops: Object): number {
    if (pops[mapParams.zoom] === undefined) {
      const geoBounds: MapBoundingBox = this.calculateGeoBounds(mapParams);
      const geoPop: number = this.countResultsInBounds(geoBounds, pins);
      pops[mapParams.zoom] = geoPop;
    }
    return pops[mapParams.zoom];
  }

  // determine the google lat/lng bounds of a region from a viewport and zoom
  public calculateGeoBounds(mapParams: MapView): MapBoundingBox {
    // at zoom 0,    256px for 180° latitude,  0.703125°/px
    //               256px for 360° longitude, 1.46025°/px
    // at zoom 1,    512px for 180° latitude,  0.3515625°/px
    //               512px for 360° longitude, 0.703125°/px
    // at zoom 2,   1024px for 180° latitude,  0.17578125°/px
    //              1024px for 360° longitude, 0.3515625°/px
    //  ...
    // at zoom n,  256*Apx for 180° latitude,  0.703125°/Apx, A = 2^n
    //            1024*Apx for 360° longitude, 1.40625°/Apx

    // vadjust compensates for the local distortion of the Mercator projection.

    const zoom = mapParams.zoom - 1; // Why adjust with "-1"? No one knows - magic danderson code.
    const docWidth = document.documentElement.clientWidth;
    const docHeight =  document.documentElement.clientHeight;
    const centerLat = mapParams.lat;
    const centerLng = mapParams.lng;

    const vadjust = 1.0 / Math.cos(Math.PI * centerLat / 180);
    const divisor = Math.pow(2, zoom);
    const halfHeight = vadjust * docHeight / 2;
    const halfLat = 0.703125 * halfHeight / divisor;
    const halfWidth = docWidth / 2;
    const halfLng = 1.406250 * halfWidth / divisor;

    const upperLeftLat: number = centerLat + halfLat;
    const bottomRightLat: number = centerLat - halfLat;
    const upperLeftLng: number = centerLng + halfLng;
    const bottomRightLng: number = centerLng - halfLng;

    const boundingBox = new MapBoundingBox(upperLeftLat, upperLeftLng, bottomRightLat, bottomRightLng);

    return boundingBox;
  }

  // Returns a count of the number of pins found within the bounding box.
  private countResultsInBounds(geoBounds: MapBoundingBox,  pins: Pin[]): number {
    return this.getPinsInBounds(geoBounds, pins).length;
  }

  // Returns an array containing the pins found within the bounding box.
  public getPinsInBounds(geoBounds: MapBoundingBox,  pins: Pin[]): Pin[] {
    return pins.filter(pinIsInBounds);

    // Tests whether a pin is within the bounding box.
    function pinIsInBounds(pin: Pin) {
      return !((pin.address.latitude > geoBounds.upperLeftLat) ||
        (pin.address.latitude < geoBounds.bottomRightLat) ||
        (pin.address.longitude > geoBounds.upperLeftLng) ||
        (pin.address.longitude < geoBounds.bottomRightLng));
    }
  }

  // Converting decimal degrees into plotable degrees minutes seconds value
  private dms(dec: number): String {
    const decSgn = (dec < 0) ? '-' : '';
    dec = Math.abs(dec);
    const decDeg = parseInt('' + dec, 10);
    const decMin = parseInt('' + (dec - decDeg) * 60.0, 10);
    const decSec = parseInt('' + (dec - decDeg - (decMin / 60.0)) * 3600.0, 10);
    return `${decSgn}${decDeg}° ${decMin}' ${decSec}"`;
  }

  public getLabelHeightAdjustment(isHostOrMe: boolean): number {
    if ( isHostOrMe ) {
      return 11;
    } else {
      return 4;
    }
  }

}
