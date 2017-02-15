import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

import { APIService } from '../services/api.service';
import { LoginRedirectService } from '../services/login-redirect.service';

@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(private apiService: APIService,
              private loginRedirectService: LoginRedirectService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (!this.apiService.isLoggedIn()) {
      this.loginRedirectService.redirectToLogin(route.url.toString());
      return false;
    } else {
      return true;
    }
  }
}