import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { MapMarker } from '../models/map-marker';
import { Pin, pinType } from '../models/pin';

import { GeoCoordinates } from '../models/geo-coordinates';
import { MapView } from '../models/map-view';

@Injectable()
export class GoogleMapService {

  public mapUpdatedEmitter: EventEmitter<GeoCoordinates>;
  public mapClearEmitter: EventEmitter<void>;
  public dataForDrawingEmitter: EventEmitter<any>;
  public clusterMarkersEmitter: EventEmitter<any>;

  public didUserAllowGeoLoc: boolean;
  public siteMarkersOnMap: any = undefined;
  public mapViewUpdatedEmitter: EventEmitter<MapView>;

  constructor() {
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
        let bounds = {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        lat: lat,
        lng: lng
        };
        return this.calculateBestZoom(bounds, zoom, pins, viewtype);
  }

  // zero in on the zoom that's closest to the target pin count without going under
  private calculateBestZoom(bounds: Object, zoom: number, pins: Pin[], viewtype: string, pops: Object = {}): number {
    let popTarget;
    if (viewtype === 'world') {
      popTarget = 10;
    } else {
      popTarget = pins.length;
    }

    let pop = this.countPopAtZoom(bounds, zoom, pins, pops);
    if (pop < popTarget) {
      if (zoom <= 3) {
        return 3;
      }
      return this.calculateBestZoom(bounds, zoom - 1, pins, viewtype, pops);
    } else if (zoom >= 20) {
      return 20;
    } else {
      let upPop = this.countPopAtZoom(bounds, zoom + 1, pins, pops);
      if (upPop < popTarget) {
        return zoom;
      } else {
        return this.calculateBestZoom(bounds, zoom + 1, pins, viewtype, pops);
      }
    }
  }

  // return the number of pins in a bounded region
  private countPopAtZoom(bounds: Object, zoom: number, pins: Pin[], pops: Object): number {
    if (pops[zoom] === undefined) {
      let geoBounds = this.calculateGeoBounds(bounds, zoom);
      let geoPop = this.countResultsInBounds(geoBounds, pins);
      pops[zoom] = geoPop;
    }
    return pops[zoom];
  }

  // determine the google lat/lng bounds of a region from a viewport and zoom
  public calculateGeoBounds(bounds: Object, zoom: number): Object {
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

    let vadjust = 1.0 / Math.cos(Math.PI * bounds['lat'] / 180);
    let divisor = Math.pow(2, zoom);
    let halfHeight = vadjust * bounds['height'] / 2;
    let halfLat = 0.703125 * halfHeight / divisor;
    let halfWidth = bounds['width'] / 2;
    let halfLng = 1.406250 * halfWidth / divisor;
    return {
      north: (bounds['lat'] + halfLat),
      south: (bounds['lat'] - halfLat),
      east: (bounds['lng'] + halfLng),
      west: (bounds['lng'] - halfLng)
    };
  }

  // count the pins in an area lat/lng bounded area
  private countResultsInBounds(geoBounds: Object,  pins: Pin[]): number {
    let counter = 0;
    for (let pin of pins) {
      if ((pin.address.latitude < geoBounds['north']) &&
        (pin.address.latitude > geoBounds['south']) &&
        (pin.address.longitude < geoBounds['east']) &&
        (pin.address.longitude > geoBounds['west'])) {
        counter++;
      }
    }
    return counter;
  }

  // Converting decimal degrees into plotable degrees minutes seconds value
  private dms(dec: number): String {
    let decSgn = (dec < 0) ? '-' : '';
    dec = Math.abs(dec);
    let decDeg = parseInt('' + dec, 10);
    let decMin = parseInt('' + (dec - decDeg) * 60.0, 10);
    let decSec = parseInt('' + (dec - decDeg - (decMin / 60.0)) * 3600.0, 10);
    return `${decSgn}${decDeg}° ${decMin}' ${decSec}"`;
  }

  public getLabelHeightAdjustment(cHeight: number, marker: MapMarker, isHostOrMe: boolean): number {

    let heightAdjustment: number = undefined;

    if ( isHostOrMe ) {
      heightAdjustment = 11;
    } else {
      heightAdjustment = 4;
    }

    return heightAdjustment;
  }

}
