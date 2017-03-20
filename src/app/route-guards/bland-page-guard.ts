import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

import { BlandPageService } from '../services/bland-page.service';

@Injectable()
export class BlandPageGuard implements CanActivate {

  constructor(private blandPageService: BlandPageService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (!this.blandPageService.primed()) {
      this.router.navigate(['/map']);
      return false;
    } else {
      return true;
    }
  }
}