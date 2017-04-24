import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

import { BlandPageService } from '../services/bland-page.service';

@Injectable()
export class HostNextStepsGuard implements CanActivate {

  constructor(private blandPageService: BlandPageService,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (!this.blandPageService.primed()) {
      this.blandPageService.primeHostNextSteps();
    }
      return true;
  }
}
