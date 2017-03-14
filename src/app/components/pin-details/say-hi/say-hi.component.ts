import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { PinService } from '../../../services/pin.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';

import { Pin } from '../../../models/pin';
import { User } from '../../../models/user';

@Component({
  selector: 'say-hi',
  templateUrl: 'say-hi.html'
})
export class SayHiComponent {

  @Input() isGathering: boolean = false;
  @Input() buttonText: string = "";
  @Input() user: User;
  @Input() pin: Pin;
  @Input() isLoggedIn: boolean = false;

  constructor(
    private pinService: PinService,
    private loginRedirectService: LoginRedirectService,
    private router: Router) { }

  ngOnInit() {
    this.sendSayHi = this.sendSayHi.bind(this);
  }

  public sayHi() {
    debugger;
    if (!this.isLoggedIn) {
      this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url, 'sayHi', this.sendSayHi);
    } else {
      this.sendSayHi(this.user);
    }
  }

  public sendSayHi(user:User) {
    if (!this.user)
      this.user = user;
    this.pinService.sendHiEmail(this.user, this.pin).subscribe(
        ret => {
          this.router.navigate(['/member-said-hi']); // Change this to generic confirmation page component
        },
        err => {
          // redirect to error page
        }

      );
  }

}
