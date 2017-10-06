import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { BlandPageService } from '../../../../services/bland-page.service';
import { PinService } from '../../../../services/pin.service';
import { StateService } from '../../../../services/state.service';
import { SessionService } from '../../../../services/session.service';

import { BlandPageDetails, BlandPageType, BlandPageCause, Pin, pinType } from '../../../../models';
import { PinsShown, pinsShown, ViewType } from '../../../../shared/constants';

@Component({
  selector: 'remove-person-pin',
  templateUrl: './remove-person-pin.component.html',
  styles: ['.fauxdal-wrapper { overflow-y: hidden; } ']
})

export class RemovePersonPinComponent implements OnInit, AfterViewInit {
  @Input() pin: Pin;
  constructor(private blandPageService: BlandPageService,
    private pinService: PinService,
    private router: Router,
    private route: ActivatedRoute,
    private state: StateService,
    private session: SessionService) { }

  public ngOnInit(): void {
    this.pin = this.route.snapshot.data['pin'];
  }

  public ngAfterViewInit() {
    // This component is rendered within a fauxdal,
    // so we need the following selector added to <body> element
    document.querySelector('body').classList.add('fauxdal-open');
    document.querySelector('body').style.overflowY = 'hidden';
  }

  public removePersonPin() {
    this.pinService.removePersonPin(this.pin.participantId).subscribe(
      () => {
        this.state.removedSelf = true;
        this.state.setDeletedPinIdentifier(this.pin.contactId, this.pin.pinType);
        this.state.cleanUpStateAfterPinUpdate();
        this.session.clearCache();
        const countOfItemsInLastSearch: number = this.state.getlastSearchResults().pinSearchResults.length;
        const viewToReturnTo: string = this.determineStateToReturnTo(countOfItemsInLastSearch, this.state.getMyViewOrWorldView());
        this.turnOffMyStuffIfReturningToWorldView(viewToReturnTo);
        this.state.setMyViewOrWorldView(viewToReturnTo);
        this.state.setCurrentView(ViewType.MAP);
        this.state.setLastSearch(null);
        const bpd = new BlandPageDetails(
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
        const bpd = new BlandPageDetails(
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
    document.querySelector('body').style.overflowY = 'auto';
  }

  private determineStateToReturnTo(countOfItemsReturnedByLastSearch: number, currentState: string): string {
    if (currentState === pinsShown.EVERYONES_STUFF) {
      return pinsShown.EVERYONES_STUFF;
    }

    const isLastMyStuffItemBeingRemoved: boolean = countOfItemsReturnedByLastSearch < 2;

    const typeOfView: string = isLastMyStuffItemBeingRemoved ? pinsShown.EVERYONES_STUFF : pinsShown.MY_STUFF;

    return typeOfView;
  }

  private turnOffMyStuffIfReturningToWorldView(currentState: string): void {
    if (currentState === pinsShown.EVERYONES_STUFF) {
      this.state.setIsMyStuffActive(false);
    }
  }
}
