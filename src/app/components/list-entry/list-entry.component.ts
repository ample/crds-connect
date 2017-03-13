import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Pin, pinType } from '../../models/pin';
import { Address } from '../../models/address';

@Component({
  selector: 'list-entry',
  templateUrl: 'list-entry.component.html',
  styleUrls: ['list-entry.component.css']
})
export class ListEntryComponent {
  @Input() firstName: string = " ";
  @Input() lastName: string = " ";
  @Input() siteName: string = "";
  @Input() type: number;
  @Input() proximity: number = 0;
  @Input() description: string = "";
  @Input() address: Address = null;
  @Input() participantId: number = 0;
  @Input() participantCount: number = 0;

  constructor(
    private router: Router
  ) {}

  public name() {
    return (this.firstName + " " + this.lastName.charAt(0) + ".").toUpperCase();
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
        return 'https://image.ibb.co/ebF9rF/PERSON.png';
      case pinType.GATHERING:
        return 'https://image.ibb.co/kpYJka/GATHERING.png';
      default:
        return 'https://image.ibb.co/di5Lyv/SITE.png';
    }
  }

  public siteAddress() {
    if (this.address === null) {
      return null;
    } else {
      let addr = this.address.addressLine1;
      if (this.address.addressLine2) {
        addr += "<br/>" + this.address.addressLine2;
      }
      addr += "<br/>" + this.address.city + ", " + this.address.state + " " + this.address.zip;
      return addr;
    }
  }

  public gatheringDescription() {
    //console.log(this.description)
    return (this.description === "") ? "This is a sample description to make sure that what needs to happen can happen." : this.description;
  }

  public displayDetails(id) {
    this.router.navigate([`pin-details/${id}/`]);
  }

  public roundedProximity() {
    return this.proximity.toFixed(1);
  }
}
