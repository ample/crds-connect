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

  public redirectToLogin(target = this.DefaultAuthenticatedRoute, queryParm = null, redirectFunction = null): void {
    this.originalTarget = target;
    queryParm ? this.originalTargetParms = queryParm : null;
    if (redirectFunction) {
      this.redirectFunction = redirectFunction;
    }
    this.router.navigate([this.SigninRoute]);
  }

  public redirectToTarget(target = this.DefaultAuthenticatedRoute, user = null): void {
    if (this.originalTarget) {
      if (this.originalTargetParms) {
        let navigationExtras: NavigationExtras = {
          queryParams: { 'q': this.originalTargetParms }
        };
        //this.router.navigate([this.originalTarget], navigationExtras);
        debugger;
        this.redirectFunction(user);
      }
      else {
        this.router.navigate([this.originalTarget]);
      }
    } else {
      this.router.navigate([target]);
    }
  }
}
