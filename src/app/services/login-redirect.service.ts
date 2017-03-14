import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable()
export class LoginRedirectService {
  private DefaultAuthenticatedRoute = '/host-signup';
  private SigninRoute = '/signin';

  private originalTarget: string;
  private originalTargetParms: string;
  private redirectFunction: any;

  constructor(private router: Router) { }

  public redirectToLogin(target = this.DefaultAuthenticatedRoute, redirectFunction = null): void {
    this.originalTarget = target;
    if (redirectFunction) {
      this.redirectFunction = redirectFunction;
    }
    this.router.navigate([this.SigninRoute]);
  }

  public redirectToTarget(target = this.DefaultAuthenticatedRoute): void {
    if (this.originalTarget) {
      if (this.redirectFunction) {
        this.redirectFunction();
      }
      else {
        this.router.navigate([this.originalTarget]);
      }
    } else {
      this.router.navigate([target]);
    }
  }
}
