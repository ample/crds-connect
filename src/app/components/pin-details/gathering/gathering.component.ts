import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Pin } from '../../../models/pin';
import { User } from '../../../models/user';
import { BlandPageDetails, BlandPageType, BlandPageCause, BlandPageButton } from '../../../models/bland-page-details';

import { APIService } from '../../../services/api.service';
import { BlandPageService } from '../../../services/bland-page.service';
import { ContentService } from '../../../services/content.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { PinService } from '../../../services/pin.service';
import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';


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

  constructor(private api: APIService,
    private content: ContentService,
    private session: SessionService,
    private pinService: PinService,
    private router: Router,
    private loginRedirectService: LoginRedirectService,
    private blandPageService: BlandPageService,
    private state: StateService) { }

  public ngOnInit() {
    if (this.loggedInUserIsInGathering(this.session.getContactId()) && this.isLoggedIn) {
      this.isInGathering = true;
    }
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
          let succButton = new BlandPageButton(
            'Return to map',
            null,
            ''
          );

          let buttons = new Array<BlandPageButton>();
          buttons.push(succButton);
          this.blandPageService.primeAndGo(new BlandPageDetails(
            '',
            BlandPageType.ContentBlock,
            BlandPageCause.Success,
            '',
            null,
            buttons));

        },
        failure => {
          let bpd;
          let errButton = new BlandPageButton(
            'Back',
            null,
            ''
          );
          let buttons = new Array<BlandPageButton>();
          buttons.push(errButton);
          if (failure.status === 409) {
            bpd = new BlandPageDetails(
              // tslint:disable-next-line:max-line-length
              '<h1 class="h1 text-center">OOPS</h1><p class="text text-center">Looks like you have already requested to join this group.</p>',
              BlandPageType.Text,
              BlandPageCause.Error,
              'pin-details/' + this.pin.participantId,
              '',
              buttons
            );
            this.blandPageService.primeAndGo(bpd);
          } else {
            this.blandPageService.goToDefaultError('pin-details/' + this.pin.participantId);
          }
        }
      );
    } else {
      this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url);
    }
  }

}
