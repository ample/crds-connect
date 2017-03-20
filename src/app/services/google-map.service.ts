import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { GeoCoordinates } from '../models/geo-coordinates';

@Injectable()
export class GoogleMapService {

  public mapUpdatedEmitter: EventEmitter<GeoCoordinates>;
  //public mapSizeSetEmitter: EventEmitter<string>;
  public dataForDrawingEmitter: EventEmitter<any>;

  public didUserAllowGeoLoc: boolean;

  constructor() {
    this.mapUpdatedEmitter = new EventEmitter<GeoCoordinates>();
    //this.mapSizeSetEmitter = new EventEmitter<string>();
    this.dataForDrawingEmitter = new EventEmitter<any>();
  }

  public emitRefreshMap(coords: GeoCoordinates): void {
    this.mapUpdatedEmitter.emit(coords);
  }

  // public emitMapSizeSet(mapSize: string): void {
  //   this.mapSizeSetEmitter.emit('lol');
  // }

  public emitDataForDrawing(data: any): void {
    this.dataForDrawingEmitter.emit(data);
  }

  public setDidUserAllowGeoLoc(value: boolean): void {
    this.didUserAllowGeoLoc = value;
  }

}
