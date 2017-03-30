import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

import { ToastsManager } from 'ng2-toastr';

import { BlandPageService } from '../services/bland-page.service';

@Injectable()
export class GettingStartedGuard implements CanActivate {

  constructor(private blandPageService: BlandPageService,
              private router: Router,
              private toast: ToastsManager) {}

  canActivate(route: ActivatedRouteSnapshot) {
    this.toast.info('This is a message', 'Title', { toastLife: 10000000 });
    this.blandPageService.setPageHeader('Getting Started', '/');
    if (!this.blandPageService.primed()) {
      this.blandPageService.primeGettingStarted();
    }
    return true;
  }
}