import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { LoginRedirectService } from '../../../services/login-redirect.service';

@Component({
  selector: 'pin-login-actions',
  templateUrl: 'pin-login-actions.html'
})
export class PinLoginActionsComponent {

  @Input() isGathering: boolean = false;

  constructor(
    private loginRedirectService: LoginRedirectService,
    private router: Router) {}

  public redirectToLogin() {
    this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url);
  }

}
