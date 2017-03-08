import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Address } from '../../../models/address';

@Component({
  selector: 'readonly-address',
  templateUrl: 'readonly-address.html'
})
export class ReadonlyAddressComponent implements OnInit {

  @Input() isGathering: boolean = false;
  @Input() isPinOwner: boolean = false;
  @Input() isInGathering: boolean = false;
  @Input() address: Address;

  public showFullAddress: boolean = false;

  constructor() {}

  public ngOnInit() {
    if ((this.isGathering && this.isInGathering) || (this.isPinOwner)){
      this.showFullAddress = true;
    }
  }

}
