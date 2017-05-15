import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable()
export class NeighborsHelperService {

  // TODO: Should this be a Subject?
  // See https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#bidirectional-service
  public changeEmitter: EventEmitter<null>;

  constructor() {
    this.changeEmitter = new EventEmitter<null>();
  }

  public emitChange(): void {
    this.changeEmitter.emit();
  }
}
