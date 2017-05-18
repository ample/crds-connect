import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { Pin, pinType } from '../../../models/pin';
import { User } from '../../../models/user';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../models/bland-page-details';
import { Participant } from '../../../models/participant';
import { Address } from '../../../models/address';

import { BlandPageService } from '../../../services/bland-page.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { PinService } from '../../../services/pin.service';
import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';
import { ParticipantService } from '../../../services/participant.service';
import { AddressService } from '../../../services/address.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'small-group',
  templateUrl: 'small-group.html'
})
export class SmallGroupComponent implements OnInit {

  @Input() pin: Pin;
  @Input() user: Pin;
  @Input() isPinOwner: boolean = false;
  @Input() isLoggedIn: boolean = false;

  public isInGathering: boolean = false;
  public sayHiButtonText: string = 'Contact host';
  private ready = false;
  private address: Address = Address.overload_Constructor_One();

  constructor(private session: SessionService,
    private pinService: PinService,
    private router: Router,
    private loginRedirectService: LoginRedirectService,
    private blandPageService: BlandPageService,
    private state: StateService,
    private participantService: ParticipantService,
    private toast: ToastsManager,
    private addressService: AddressService,
    private content: ContentService,
    private angulartics2: Angulartics2) { }

  public ngOnInit() {
    window.scrollTo(0, 0);
    this.requestToJoin = this.requestToJoin.bind(this);
    this.state.setLoading(true);
    this.state.setPageHeader('gathering', '/');
    try {
    this.participantService.getParticipants(this.pin.gathering.groupId).subscribe(
      participants => {
        this.pin.gathering.Participants = participants;
        if (this.loggedInUserIsInGathering(this.session.getContactId())) {
          this.isInGathering = true;
          this.addressService.getFullAddress(this.pin.gathering.groupId, pinType.GATHERING)
            .finally(() => {
              this.state.setLoading(false);
              this.ready = true;
            })
            .subscribe(
            address => {
              this.pin.gathering.address = address;
            },
            error => {
              this.toast.error(this.content.getContent('errorRetrievingFullAddress'));
            }
            );
        } else {
          this.state.setLoading(false);
          this.ready = true;
        }
      },
      failure => {
        console.log('Could not get participants');
        this.blandPageService.goToDefaultError('');
      });
    } catch (err) {
      this.blandPageService.goToDefaultError('');
    }
  }

  private loggedInUserIsInGathering(contactId: number) {
    return this.pin.gathering.Participants.find((participant) => {
      return (participant.contactId === contactId);
    });
  }

  public requestToJoin() {
    this.angulartics2.eventTrack.next({ action: 'Join Gathering Button Click', properties: { category: 'Connect' }});
    if (this.session.isLoggedIn()) {
      this.state.setLoading(true);
      this.pinService.requestToJoinGathering(this.pin.gathering.groupId)
      .subscribe(
        success => {
          this.blandPageService.primeAndGo(new BlandPageDetails(
            'Return to map',
            'finderGatheringJoinRequestSent',
            BlandPageType.ContentBlock,
            BlandPageCause.Success,
            ''
          ));
        },
        failure => {
          this.state.setLoading(false);
          if (failure.status === 409) {
            this.toast.warning(this.content.getContent('finderAlreadyRequestedJoin'));
          } else if (failure.status === 406) {
            // Already in group...do nothing.
          } else {
            this.toast.error(this.content.getContent('generalError'));
          }
          // If we're at the signin or register page, come back to the gathering details. 
          if (!this.router.url.includes('gathering')) {
            this.loginRedirectService.redirectToTarget();
          }
        }
      );
    } else {
      this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url, this.requestToJoin);
    }
  }

  public edit() {
    this.router.navigate(['/gathering', this.pin.gathering.groupId, 'edit']);
  }

}
