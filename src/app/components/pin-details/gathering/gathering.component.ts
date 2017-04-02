import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { Pin } from '../../../models/pin';
import { User } from '../../../models/user';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../models/bland-page-details';

import { BlandPageService } from '../../../services/bland-page.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { PinService } from '../../../services/pin.service';
import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';
import { ParticipantService } from '../../../services/participant.service';


@Component({
  selector: 'gathering',
  templateUrl: 'gathering.html'
})
export class GatheringComponent implements OnInit {

  @Input() pin: Pin;
  @Input() user: User;
  @Input() isPinOwner: boolean = false;
  @Input() isLoggedIn: boolean = false;

  public isInGathering: boolean = false;
  public sayHiButtonText: string = 'Contact host';

  constructor(private session: SessionService,
    private pinService: PinService,
    private router: Router,
    private loginRedirectService: LoginRedirectService,
    private blandPageService: BlandPageService,
    private state: StateService,
    private participantService: ParticipantService,
    private toast: ToastsManager) { }

  public ngOnInit() {
    this.state.setLoading(true);
    this.participantService.getParticipants(this.pin.gathering.groupId).subscribe(
      success => {
        this.pin.gathering.Participants = success;
        if (this.loggedInUserIsInGathering(this.session.getContactId()) && this.isLoggedIn) {
          this.isInGathering = true;
        }
        this.state.setLoading(false);
      },
      failure => {
        console.log('Could not get participants');
        this.blandPageService.goToDefaultError('');
      });
  }

  private loggedInUserIsInGathering(contactId: number) {
    return this.pin.gathering.Participants.find((participant) => {
      return (participant.contactId === contactId);
    });
  }

  public requestToJoin() {
    if (this.isLoggedIn) {
      this.state.setLoading(true);
      this.pinService.requestToJoinGathering(this.pin.gathering.groupId).subscribe(
        success => {
           this.blandPageService.primeAndGo(new BlandPageDetails(
            'Return to map',
            'gatheringJoinRequestSent',
            BlandPageType.ContentBlock,
            BlandPageCause.Success,
            ''
          ));
        },
        failure => {
          this.state.setLoading(false);
          if (failure.status === 409) {
            this.toast.warning('Looks like you have already requested to join this group', 'OOPS');
          } else {
            this.toast.error('Looks like there was an error. Please fix and try again', 'Oh no!');
          }
        }
      );
    } else {
      this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url);
    }
  }

}
