import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable()
export class LoginRedirectService {
  private DefaultAuthenticatedRoute = '/map';
  private SigninRoute = '/signin';

  private originalTarget: string;
  private originalTargetParms: string;
  private redirectFunctionParam: any;
  private redirectFunction: any;

  constructor(private router: Router) { }

  public redirectToLogin(target = this.DefaultAuthenticatedRoute, redirectFunctionParam = null): void {
    this.originalTarget = target;
    if (redirectFunctionParam) {
      this.redirectFunction = redirectFunctionParam;
    }
    this.router.navigate([this.SigninRoute]);
  }

  public redirectToTarget(target = this.DefaultAuthenticatedRoute, useRedirectFunction = null): void {
    if (this.originalTarget) {
      if (useRedirectFunction) {
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
