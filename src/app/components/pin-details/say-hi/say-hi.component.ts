import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AnalyticsService } from '../../../services/analytics.service';
import { BlandPageService } from '../../../services/bland-page.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { PinService } from '../../../services/pin.service';
import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';

import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../models/bland-page-details';
import { Pin, User } from '../../../models';

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
    private analytics: AnalyticsService) { }

  // TODO: Rename methods?
  ngOnInit() {
    this.getUserDetailsThenSayHi = this.getUserDetailsThenSayHi.bind(this);
  }

  public sayHi() {
    this.analytics.sayHiButtonPressed(`${this.buttonText} Button Click`, 'Connect');
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
    const templateText = `<h1 class="title">${this.isGathering ? 'Host contacted' : 'Success!'}</h1>`;
    const notificationText = (this.isGathering) ? `<p>${this.pin.firstName} ${this.pin.lastName.slice(0, 1)}. has been notified</p>`
      : `<p>You just said hi to ${this.pin.firstName} ${this.pin.lastName.slice(0, 1)}.</p>`;
    const bpd = new BlandPageDetails(
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

  private handleError() {
    const bpd = new BlandPageDetails();
    bpd.blandPageCause = BlandPageCause.Error;
    bpd.content = '<h1 class="title">Sorry!</h1><p>We are unable to send your email at this time.</p>';
    bpd.goToState = this.isGathering ? '/gathering/' + this.pin.gathering.groupId : '/person/' + this.pin.participantId;
    bpd.buttonText = 'Return to details page';
    this.blandPageService.primeAndGo(bpd);
  }
}
