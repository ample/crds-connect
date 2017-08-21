import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { StateService } from '../../../../services/state.service';
import { SessionService } from '../../../../services/session.service';

import { PinService } from '../../../../services/pin.service';
import { Pin, pinType } from '../../../../models/pin';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';
import { BlandPageService } from '../../../../services/bland-page.service';

import {PinsShown, pinsShown, ViewType } from '../../../../shared/constants';

@Component({
  selector: 'remove-person-pin',
  templateUrl: './remove-person-pin.component.html'
})

export class RemovePersonPinComponent implements OnInit {
  @Input() pin: Pin;
  constructor(private router: Router,
    private route: ActivatedRoute,

    private state: StateService,
    private session: SessionService,

    private content: ContentService,
    private blandPageService: BlandPageService,
    private pinService: PinService, ) { }

  public ngOnInit(): void {
    this.pin = this.route.snapshot.data['pin'];
  }

  public ngAfterViewInit() {
    // This component is rendered within a fauxdal,
    // so we need the following selector added to <body> element
    document.querySelector('body').classList.add('fauxdal-open');
  }

  private determineStateToReturnTo(countOfItemsReturnedByLastSearch: number, currentState: string): string {
    if(currentState === pinsShown.EVERYONES_STUFF) {
      return pinsShown.EVERYONES_STUFF;
    }

    let isLastMyStuffItemBeingRemoved: boolean = countOfItemsReturnedByLastSearch < 2;

    let typeOfView: string = isLastMyStuffItemBeingRemoved ? pinsShown.EVERYONES_STUFF : pinsShown.MY_STUFF;

    return typeOfView;
  }

  private turnOffMyStuffIfReturningToWorldView(currentState: string): void {
    if (currentState === pinsShown.EVERYONES_STUFF) {
      this.state.setIsMyStuffActive(false);
    }
  }

  public removePersonPin() {
    this.pinService.removePersonPin(this.pin.participantId).subscribe(
      () => {
        this.state.removedSelf = true;
        this.state.setDeletedPinIdentifier(this.pin.contactId, this.pin.pinType);
        this.state.cleanUpStateAfterPinUpdate();
        this.session.clearCache();
        let countOfItemsInLastSearch: number = this.state.getlastSearchResults().pinSearchResults.length;
        let viewToReturnTo: string = this.determineStateToReturnTo(countOfItemsInLastSearch, this.state.getMyViewOrWorldView());
        this.turnOffMyStuffIfReturningToWorldView(viewToReturnTo);
        this.state.setMyViewOrWorldView(viewToReturnTo);
        this.state.setCurrentView(ViewType.MAP);
        this.state.setLastSearch(null);
        let bpd = new BlandPageDetails(
          'Return to map',
          'You have been removed from the map',
          BlandPageType.Text,
          BlandPageCause.Success,
          '',
          ''
        );
        this.blandPageService.primeAndGo(bpd);
      },
      err => {
        let bpd = new BlandPageDetails(
          'Return to map',
          'We were not able to remove you from the map',
          BlandPageType.Text,
          BlandPageCause.Error,
          '',
          ''
        );
        this.blandPageService.primeAndGo(bpd);
      }

    );
  }

  public cancel() {
    console.log(this.pin);
    this.router.navigate(['/person/', this.pin.participantId, 'edit']);
  }
}
