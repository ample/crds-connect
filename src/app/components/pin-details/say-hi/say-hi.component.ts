import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { PinService } from '../../../services/pin.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { APIService } from '../../../services/api.service';
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
  @Input() successButtonText: string = '';
  @Input() errorButtonText: string = '';
  @Input() user: User;
  @Input() pin: Pin;
  @Input() isLoggedIn: boolean = false;

  constructor(
    private pinService: PinService,
    private loginRedirectService: LoginRedirectService,
    private api: APIService,
    private router: Router,
    private blandPageService: BlandPageService) { }


  ngOnInit() {
    this.sendSayHi = this.sendSayHi.bind(this);
  }

  public sayHi() {
    if (!this.isLoggedIn) {
      this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url, this.sendSayHi);
    } else {
      this.sendSayHi();
    }
  }

  public sendSayHi() {
    let bpd = new BlandPageDetails(
          'Return to map',
          '',
          '<div class="container"><div class="row text-center"><h3>Success!</h3></div></div>',
          BlandPageType.Text,
          BlandPageCause.Success,
          ''
        );
    let bpdErr = new BlandPageDetails(
          'Return to map',
          'Retry Say Hi',
          `<div class="container"><div class="row text-center"><h3>Error!</h3></div>
            <div>An error occurred while we were trying to say hi. You can try again or return to the map.</div></div>`,
          BlandPageType.Text,
          BlandPageCause.Error,
          ''
        );
    if (!this.user) {
      this.api.getUserData().subscribe(
        ret => {
          this.user = ret;
          this.pinService.sendHiEmail(this.user, this.pin).subscribe(
            out => {
              this.blandPageService.primeAndGo(bpd);
            },
            err => {
              this.sendHiError(err);
            }

          );
        },
        err => {
          this.sendHiError(err);
        }
      );

    } else {
      this.pinService.sendHiEmail(this.user, this.pin).subscribe(
        ret => {
          this.blandPageService.primeAndGo(bpd);
        },
        err => {
          this.sendHiError(err);
        }

      );
    }
  }

  private sendHiError(err) {
    // page: same as success, try again?
  }


}
