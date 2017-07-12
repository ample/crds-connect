import { Angulartics2 } from 'angulartics2';
import { Component, HostListener, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { GoogleMapService } from '../../services/google-map.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { ToastsManager } from 'ng2-toastr';

import { crdsOakleyCoords } from '../../shared/constants';
import { MapSettings } from '../../models/map-settings';
import { Address } from '../../models/address';
import { Pin, pinType } from '../../models/pin';
import { PinSearchResultsDto } from '../../models/pin-search-results-dto';

import { PinLabelService } from '../../services/pin-label.service';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';
import { SessionService } from '../../services/session.service';
import { UserLocationService } from '../../services/user-location.service';
import { GoogleMapClusterDirective } from '../../directives/google-map-cluster.directive';
import { GeoCoordinates } from '../../models/geo-coordinates';
import { MapView } from '../../models/map-view';

@Component({
  selector: 'email-participants',
  templateUrl: 'email-participants.component.html'
})
export class EmailParticipantsComponent implements OnInit {

  @Input() participantEmails: string[];
  public areThereAnyParticipantsInGroup: boolean;
  public mapSettings: MapSettings = new MapSettings(crdsOakleyCoords.lat, crdsOakleyCoords.lng, 5, false, true);

  constructor(private userLocationService: UserLocationService,
              private pinLabelService: PinLabelService,
              private pinHlpr: PinService,
              private router: Router,
              private mapHlpr: GoogleMapService,
              private toastr: ToastsManager,
              private state: StateService,
              private session: SessionService) {

  }

  //TODO: Remove testing code
  @HostListener('document:copy', ['$event'])
  onCopy(event) {
    console.log('COPY EVENT PICKED UP!');
  }

  public ngOnInit(): void {
    this.areThereAnyParticipantsInGroup = this.participantEmails.length > 0;
  }

  public copyEmailAddressesClicked(participantEmails: string[]): void {
    this.displayEmailsCopiedToClipboardToast(participantEmails);
  }

  public displayEmailsCopiedToClipboardToast(participantEmails: string[]): void {
    let addressSuffix: string = this.participantEmails.length === 1 ? '' : 'es';
    let toastMsg: string = `${this.participantEmails.length} email address${addressSuffix} copied to clipboard!`;
    this.toastr.success(toastMsg);
  }

}
