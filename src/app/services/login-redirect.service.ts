import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable()
export class LoginRedirectService {
  private DefaultAuthenticatedRoute = '/map';
  private SigninRoute = '/signin';

  private originalTarget: string;
  private originalTargetParms: string;
  private redirectFunctionParam: any;
  private redirectFunction: Function;

  constructor(private router: Router) { }

  public redirectToLogin(target = this.DefaultAuthenticatedRoute, redirectFunctionParam = null): void {
    this.originalTarget = target;
    if (redirectFunctionParam) {
      this.redirectFunction = redirectFunctionParam;
    }
    this.router.navigate([this.SigninRoute]);
  }

  public redirectToTarget(target = this.DefaultAuthenticatedRoute): void {
    if (this.originalTarget) {
      if (this.redirectFunction) {
        let tempFunc = this.redirectFunction;
        this.redirectFunction = null;
        tempFunc();
      } else {
        this.router.navigate([this.originalTarget], { skipLocationChange: true });
      }
    } else {
      this.router.navigate([target]);
    }
  }

  public cancelRedirect(target = this.DefaultAuthenticatedRoute ): void {
    if (this.originalTarget) {
      this.redirectFunction = null;
      this.router.navigate([this.originalTarget]);
    } else {
      this.router.navigate([target]);
    }
  }

}
