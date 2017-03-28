import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { MapView } from '../models/map-view';

@Injectable()
export class SearchLocalService {

  public doLocalSearchEmitter: EventEmitter<MapView>;

  constructor() {
    this.doLocalSearchEmitter = new EventEmitter<MapView>();
  }

  public emitLocalSearch(mapView: MapView): void {
    this.doLocalSearchEmitter.emit(mapView);
  }

}
