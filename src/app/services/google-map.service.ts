import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { GeoCoordinates } from '../models/geo-coordinates';
import { MapView } from '../models/map-view';

@Injectable()
export class GoogleMapService {

  public mapUpdatedEmitter: EventEmitter<GeoCoordinates>;
  public didUserAllowGeoLoc: boolean;
  public mapViewUpdatedEmitter: EventEmitter<MapView>;

  constructor() {
    this.mapUpdatedEmitter = new EventEmitter<GeoCoordinates>();
    this.mapViewUpdatedEmitter = new EventEmitter<MapView>();
  }

  public emitRefreshMap(coords: GeoCoordinates): void {
    this.mapUpdatedEmitter.emit(coords);
  }

  public setDidUserAllowGeoLoc(value: boolean): void {
    this.didUserAllowGeoLoc = value;
  }

  public emitMapViewUpdated(mapView: MapView): void {
    this.mapViewUpdatedEmitter.emit(mapView);
  }

}
