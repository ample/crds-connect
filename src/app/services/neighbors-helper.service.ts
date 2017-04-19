import { EventEmitter  } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable()
export class NeighborsHelperService {

  public changeEmitter: EventEmitter<null>;

  constructor() {
    this.changeEmitter = new EventEmitter<null>();
  }

  public emitChange(): void {
    this.changeEmitter.emit();
  }
}
