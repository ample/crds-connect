import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { GeoCoordinates } from '../models/geo-coordinates';

@Injectable()
export class GoogleMapService {

  public mapUpdatedEmitter: EventEmitter<GeoCoordinates>;
  public didUserAllowGeoLoc: boolean;

  constructor() {
    this.mapUpdatedEmitter = new EventEmitter<GeoCoordinates>();
  }

  public emitRefreshMap(coords: GeoCoordinates): void {
    this.mapUpdatedEmitter.emit(coords);
  }

  public setDidUserAllowGeoLoc(value: boolean): void {
    this.didUserAllowGeoLoc = value;
  }

}
