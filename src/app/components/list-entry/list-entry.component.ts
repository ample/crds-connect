import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Pin, pinType } from '../../models/pin';
import { Address } from '../../models/address';

import { AppSettingsService } from '../../services/app-settings.service';
import { ListHelperService } from '../../services/list-helper.service';
import { PinService } from '../../services/pin.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';

import { groupDescriptionLength } from '../../shared/constants';

@Component({
  selector: 'list-entry',
  templateUrl: 'list-entry.component.html'
})
export class ListEntryComponent implements OnInit {
  @Input() pin: Pin;
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() siteName: string = '';
  @Input() type: number;
  @Input() proximity: number = 0;
  @Input() groupTitle: string = '';
  @Input() description: string = '';
  @Input() groupId: number = 0;
  @Input() address: Address = null;
  @Input() participantId: number = 0;
  @Input() participantCount: number = 0;
  @Input() contactId: number = 0;

  public currentContactId: number;
  public isGathering: boolean;
  public isPerson: boolean;
  public isSite: boolean;
  public isSmallGroup: boolean;

  constructor(private appSettings: AppSettingsService,
              private pinService: PinService,
              private session: SessionService,
              private router: Router,
              private state: StateService,
              private listHelper: ListHelperService) {
              this.currentContactId = this.session.getContactId();
  }

  public ngOnInit() {
    this.isPerson = this.type === pinType.PERSON;
    this.isGathering = this.type === pinType.GATHERING;
    this.isSite = this.type === pinType.SITE;
    this.isSmallGroup = this.type === pinType.SMALL_GROUP;
  }

  public isMe() {
    return this.contactId === this.currentContactId;
  }

  public isMyGathering() {
    return this.type === pinType.GATHERING && this.contactId === this.currentContactId;
  }

  public formatName() {
    if (this.isSmallGroup) {
      return this.groupTitle ? this.listHelper.truncateTextEllipsis(this.groupTitle.toUpperCase(), groupDescriptionLength) : '';
    } else {
      return (this.firstName + ' ' + this.lastName.charAt(0) + '.').toUpperCase();
    }
  }

  public leaderName() {
    return (this.firstName + ' ' +  (this.lastName.length > 0 ? this.lastName.charAt(0) : '') + '.');
  }

  public isMySmallGroup() {
    return this.type === pinType.SMALL_GROUP && this.contactId === this.currentContactId;
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
      let addr = this.address.city + ', ' + this.address.state + ' ' + this.address.zip;
      return addr;
    }
  }

  public gatheringDescription() {
    return (this.description === '') ? 'This is a sample description to make sure that what needs to happen can happen.' : this.description;
  }

  public sayHi(id) {
    this.state.setCurrentView('list');
    this.router.navigate([`person/${id}/`]);
  }

  public displayPinDetails(pin: Pin) {
    this.state.setCurrentView('list');
    this.pinService.navigateToPinDetailsPage(pin);
  }

}
