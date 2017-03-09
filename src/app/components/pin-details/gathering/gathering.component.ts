import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Pin } from '../../../models/pin';
import { User } from '../../../models/user';

import { SessionService } from '../../../services/session.service';
import { APIService } from '../../../services/api.service';
import { ContentService } from '../../../services/content.service';
import { PinService } from '../../../services/pin.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';



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
    private loginRedirectService: LoginRedirectService
  ) { }

  public ngOnInit() {
    if (this.loggedInUserIsInGathering(this.session.getContactId()) && this.isLoggedIn) {
      this.isInGathering = true;
    }
  }

  public loggedInUserIsInGathering(contactId: number) {
    return this.pin.gathering.Participants.find((participant) => {
      return (participant.contactId === contactId);
    });
  }

  public requestToJoin() {
    if (this.isLoggedIn) {
      this.pinService.requestToJoinGathering(this.pin.gathering.groupId).subscribe(
        success => {
          //go to success page
        },
        failure => {
          //how are we logging errors.
        }
      );
    } else {
      this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url);
    }
  }

}
