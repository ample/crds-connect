import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class PageNotFoundGuard implements CanActivate {
  private params: string;
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    window.location.href = window.location.origin + '/notfound';
    return false;
  }
}
