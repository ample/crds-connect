import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';

import { Address } from '../../../models/address';
import { Pin, pinType } from '../../../models/pin';

@Component({
  selector: 'pin-header',
  templateUrl: 'pin-header.html'
})
export class PinHeaderComponent {

  @Input() pinType: pinType = undefined;
  @Input() isPinOwner: boolean = false;
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() userImage: string = 'https://image.ibb.co/gQGf0a/GRAYGUY.png';
  @Input() contactId: number;

  public _pinType: any = pinType;

  constructor() {}

  ngOnInit() {
    this.isPinOwner = pinType.SMALL_GROUP ? false : this.isPinOwner; //default until group owner logic defined
    let doShowHelloMsg: boolean =  !this.isPinOwner
      && this.pinType !== pinType.GATHERING
      && this.pinType !== pinType.SMALL_GROUP;
  }

}
