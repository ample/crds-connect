import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { GeoCoordinates } from '../models/geo-coordinates';

@Injectable()
export class GoogleMapService {

  public mapUpdatedEmitter: EventEmitter<GeoCoordinates>;
  public mapClearEmitter: EventEmitter<void>;
  public dataForDrawingEmitter: EventEmitter<any>;
  public clusterMarkersEmitter: EventEmitter<any>;

  public didUserAllowGeoLoc: boolean;

  constructor() {
    this.mapUpdatedEmitter = new EventEmitter<GeoCoordinates>();
    this.mapClearEmitter = new EventEmitter<void>();
    this.dataForDrawingEmitter = new EventEmitter<any>();
    this.clusterMarkersEmitter = new EventEmitter<any>();
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

}
