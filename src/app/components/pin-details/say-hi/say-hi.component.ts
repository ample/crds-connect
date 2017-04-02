import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { PinService } from '../../../services/pin.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { SessionService } from '../../../services/session.service';
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
  @Input() user: User;
  @Input() pin: Pin;
  @Input() isLoggedIn: boolean = false;

  private route: string;

  constructor(
    private pinService: PinService,
    private loginRedirectService: LoginRedirectService,
    private session: SessionService,
    private router: Router,
    private blandPageService: BlandPageService) { }


  ngOnInit() {
    this.getUserDetailsThenSayHi = this.getUserDetailsThenSayHi.bind(this);
  }

  public sayHi() {
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
        if (this.session.getContactId() == this.pin.contactId) {
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
    let templateText =  `<div class="container"><div class="row text-center"><h3>${this.isGathering ? 'Host contacted' : 'Success!'}</h3></div></div>`;
    let notificationText = `<div class="row text-center">${this.pin.firstName} ${this.pin.lastName.slice(0, 1)}. has been notified</div>`;
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
    bpd.content = '<div class="container"><div class="row text-center"><h3>We are unable to send your email at this time.</h3></div></div>';
    bpd.goToState = '';
    bpd.buttonText = 'Return to pin';
    this.blandPageService.primeAndGo(bpd);
  }
}
