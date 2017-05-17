import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { PinService } from '../../../services/pin.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';
import { BlandPageService } from '../../../services/bland-page.service';


import { Pin } from '../../../models/pin';
import { User } from '../../../models/user';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../models/bland-page-details';

@Component({
  selector: 'say-hi',
  templateUrl: 'say-hi.html'
})
export class SayHiComponent implements OnInit {

  @Input() isGathering: boolean = false;
  @Input() buttonText: string = '';
  @Input() user: Pin;
  @Input() pin: Pin;
  @Input() isLoggedIn: boolean = false;

  private route: string;

  constructor(
    private pinService: PinService,
    private loginRedirectService: LoginRedirectService,
    private session: SessionService,
    private router: Router,
    private state: StateService,
    private blandPageService: BlandPageService,
    private angulartics2: Angulartics2) { }

  // TODO: Rename methods?
  ngOnInit() {
    this.getUserDetailsThenSayHi = this.getUserDetailsThenSayHi.bind(this);
  }

  public sayHi() {
    this.angulartics2.eventTrack.next({ action: this.buttonText + ' Button Click', properties: { category: 'Connect' }});
    if (!this.isLoggedIn) {
      this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url, this.getUserDetailsThenSayHi);
    } else {
      this.doSayHi();
    }
  }

  private getUserDetailsThenSayHi() {
    this.session.getUserData().subscribe(
      ret => {
        this.user = ret;
        if (this.session.getContactId() === this.pin.contactId) {
          if (this.isGathering) {
            this.router.navigate(['/gathering/' + this.pin.gathering.groupId]);
          } else {
            this.router.navigate(['/person/' + this.pin.participantId]);
          }
        } else {
          this.doSayHi();
        }
      },
      err => {
        this.handleError();
      }
    );
  }

  private doSayHi() {
    // tslint:disable-next-line:max-line-length
    let templateText =  `<h1 class="title">${this.isGathering ? 'Host contacted' : 'Success!'}</h1>`;
    let notificationText = (this.isGathering) ? `<p>${this.pin.firstName} ${this.pin.lastName.slice(0, 1)}. has been notified</p>`
                                              : `<p>You just said hi to ${this.pin.firstName} ${this.pin.lastName.slice(0, 1)}.</p>`;
    let bpd = new BlandPageDetails(
      'Return to map',
      templateText + notificationText,
      BlandPageType.Text,
      BlandPageCause.Success,
      ''
    );
    this.pinService.sendHiEmail(this.user, this.pin).subscribe(
      ret => {
        this.blandPageService.primeAndGo(bpd);
      },
      err => {
        this.handleError();
      }
    );
  }

  handleError() {
    let bpd = new BlandPageDetails();
    bpd.blandPageCause = BlandPageCause.Error;
    bpd.content = '<h1 class="title">Sorry!</h1><p>We are unable to send your email at this time.</p>';
    bpd.goToState = this.isGathering ? '/gathering/' + this.pin.gathering.groupId : '/person/' + this.pin.participantId;
    bpd.buttonText = 'Return to details page';
    this.blandPageService.primeAndGo(bpd);
  }
}
