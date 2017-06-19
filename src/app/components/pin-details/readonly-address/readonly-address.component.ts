import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Address } from '../../../models/address';

@Component({
  selector: 'readonly-address',
  templateUrl: 'readonly-address.html'
})
export class ReadonlyAddressComponent implements OnInit {

  @Input() isGathering: boolean = false;
  @Input() isLeader: boolean = false;
  @Input() isInGathering: boolean = false;
  @Input() address: Address;
  @Input() distance: number = null;

  public distString = '';
  public showFullAddress: boolean = false;
  // TODO: Move this component up one level
  public ngOnInit() {
    if ((this.isGathering && this.isInGathering) || this.isLeader) {
      this.showFullAddress = true;
    }
    if (this.distance != null) {
      this.distString = `(${this.distance.toFixed(2).toString()} mi)`;
    } else if (this.distance == null && this.address != null
               && this.address.addressId === 0 ) {
      this.distString = 'Online Group';
    }
  }

}
