import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Pin, pinType } from '../../models/pin';
import { Address } from '../../models/address';

import { StateService } from '../../services/state.service';

@Component({
  selector: 'list-entry',
  templateUrl: 'list-entry.component.html'
})
export class ListEntryComponent {
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() siteName: string = '';
  @Input() type: number;
  @Input() proximity: number = 0;
  @Input() description: string = '';
  @Input() address: Address = null;
  @Input() participantId: number = 0;
  @Input() participantCount: number = 0;

  constructor(
    private router: Router,
    private state: StateService
  ) {}

  public name() {
    return (this.firstName + ' ' + this.lastName.charAt(0) + '.').toUpperCase();
  }

  public isPerson() {
    return this.type === pinType.PERSON;
  }

  public isGathering() {
    return this.type === pinType.GATHERING;
  }

  public isSite() {
    return this.type === pinType.SITE;
  }

  public getPicByPinType() {
    switch (this.type) {
      case pinType.PERSON:
      case pinType.GATHERING:
        return 'https://image.ibb.co/gQGf0a/GRAYGUY.png';
      default:
        return 'https://image.ibb.co/di5Lyv/SITE.png';
    }
  }

  public count() {
    if (this.participantCount === 1) {
      return `1 OTHER`;
    } else {
      return `${this.participantCount} OTHERS`;
    }
  }

  public siteAddress() {
    if (this.address === null) {
      return null;
    } else {
      let addr = this.address.addressLine1;
      if (this.address.addressLine2) {
        addr += '<br/>' + this.address.addressLine2;
      }
      addr += '<br/>' + this.address.city + ', ' + this.address.state + ' ' + this.address.zip;
      return addr;
    }
  }

  public gatheringDescription() {
    return (this.description === '') ? 'This is a sample description to make sure that what needs to happen can happen.' : this.description;
  }

  public sayHi(id) {
    this.state.setCurrentView('list');
    this.router.navigate([`pin-details/${id}/`]);
  }

  public displayDetails(id) {
    this.state.setCurrentView('list');
    this.router.navigate([`pin-details/${id}/`]);
  }

  public roundedProximity() {
    return this.proximity.toFixed(1);
  }
}
