import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { MapView } from '../models/map-view';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SearchService {

  // These should probably both be Subject observables and not event emitters. 
  // See https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
  public doLocalSearchEmitter: EventEmitter<MapView>;

  // TODO: Replace with Subject
  // See https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
  public mySearchResultsEmitter: Subject<PinSearchResultsDto> = new Subject<PinSearchResultsDto>();

  constructor() {
    this.doLocalSearchEmitter = new EventEmitter<MapView>();
    this.mySearchResultsEmitter = new EventEmitter<PinSearchResultsDto>();
  }

  public emitLocalSearch(mapView: MapView): void {
    this.doLocalSearchEmitter.emit(mapView);
  }

  public emitMyStuffSearch(searchResults: PinSearchResultsDto): void {
    this.mySearchResultsEmitter.next(searchResults);
  }

}
