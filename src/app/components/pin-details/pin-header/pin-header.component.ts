import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { StateService } from '../../../services/state.service';

import { Address } from '../../../models/address';
import { Pin, pinType } from '../../../models/pin';

@Component({
  selector: 'pin-header',
  templateUrl: 'pin-header.html'
})
export class PinHeaderComponent {

  @Input() pin: Pin = undefined;
  @Input() isPinOwner: boolean = false;

  public _pinType: any = pinType;

  constructor(private state: StateService) {}

  ngOnInit() {
    this.isPinOwner = pinType.SMALL_GROUP ? false : this.isPinOwner; //default until group owner logic defined
    let doShowHelloMsg: boolean =  !this.isPinOwner
      && this.pin.pinType !== pinType.GATHERING
      && this.pin.pinType !== pinType.SMALL_GROUP;
  }

}
