import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

import { SessionService } from '../services/session.service';
import { LoginRedirectService } from '../services/login-redirect.service';

@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(private session: SessionService,
    private loginRedirectService: LoginRedirectService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (!this.session.isLoggedIn()) {
      this.loginRedirectService.redirectToLogin(route.url.toString().replace(',', '/'));
      return false;
    } else {
      return true;
    }
  }
}
