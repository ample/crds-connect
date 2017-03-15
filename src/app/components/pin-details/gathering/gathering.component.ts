import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Pin } from '../../../models/pin';
import { User } from '../../../models/user';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../models/bland-page-details';

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
  public sayHiButtonText: string = "Contact host";

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
          this.blandPageService.setBlandPageDetailsAndGo(new BlandPageDetails(
            "Return to map",
            "gatheringJoinRequestSent",
            "",
            BlandPageType.ContentBlock,
            BlandPageCause.Success
          ));
        },
        failure => {
          let bpd;
          if (failure.status == 409) {
            bpd = new BlandPageDetails(
              "back",
              "<h1 class='h1 text-center'>OOPS</h1><p class='text text-center'>Looks like you have already requested to join this group.</p>",
              "pin-details/" + this.pin.participantId,
              BlandPageType.Text,
              BlandPageCause.Error
            );
            this.blandPageService.setBlandPageDetailsAndGo(bpd);
          } else {
            this.blandPageService.goToDefaultError("pin-details/" + this.pin.participantId);
          }
        }
      );
    } else {
      this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url);
    }
  }

}
