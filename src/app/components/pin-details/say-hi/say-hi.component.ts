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
            console.log('is gathering and same user');
            this.router.navigate(['/gathering/' + this.pin.gathering.groupId]);
          } else {
            console.log('is person and same user');
            this.router.navigate(['/person/' + this.pin.participantId]);
          }
        } else {
          this.doSayHi();
        }
      },
      err => {

      }
    );
  }

  private doSayHi() {
    let bpd = new BlandPageDetails(
      'Return to map',
      '<div class="container"><div class="row text-center"><h3>Host contacted</h3></div></div>',
      BlandPageType.Text,
      BlandPageCause.Success,
      ''
    );
    this.pinService.sendHiEmail(this.user, this.pin).subscribe(
      ret => {
        console.log('said hi');
        this.blandPageService.primeAndGo(bpd);
      },
      err => {
        console.log('said hi err');
        // redirect to error page
      }
    );
  }
}
