import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { MapView } from '../models/map-view';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';

@Injectable()
export class SearchService {

  public doLocalSearchEmitter: EventEmitter<MapView>;
  public mySearchResultsEmitter: EventEmitter<PinSearchResultsDto>;

  constructor() {
    this.doLocalSearchEmitter = new EventEmitter<MapView>();
    this.mySearchResultsEmitter = new EventEmitter<PinSearchResultsDto>();
  }

  public emitLocalSearch(mapView: MapView): void {
    this.doLocalSearchEmitter.emit(mapView);
  }

  public emitMyStuffSearch(searchResults: PinSearchResultsDto): void {
    this.mySearchResultsEmitter.emit(searchResults);
  }

}
