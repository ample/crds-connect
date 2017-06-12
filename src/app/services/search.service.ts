import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

import { MapView } from '../models/map-view';
import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SearchService {

  // These should probably both be Subject observables and not event emitters. 
  // See https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
  public doLocalSearchEmitter: Subject<MapView> = new Subject<MapView>();

  // TODO: Replace with Subject
  // See https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
  public mySearchResultsEmitter: Subject<PinSearchResultsDto> = new Subject<PinSearchResultsDto>();

  constructor() {
  }

  public emitLocalSearch(mapView: MapView): void {
    this.doLocalSearchEmitter.next(mapView);
  }

  public emitMyStuffSearch(searchResults: PinSearchResultsDto): void {
    this.mySearchResultsEmitter.next(searchResults);
  }

  // //TODO: Define query params and return type (Observable<PinDto>
  // public searchPins(queryParams: any): Subject<PinSearchResultsDto>  {
  //
  //   let subject: Subject<PinSearchResultsDto>  = new Subject();
  //
  //
  //
  //   return subject;
  //
  // }

}
