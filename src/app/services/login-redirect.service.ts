import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable()
export class LoginRedirectService {
  private DefaultAuthenticatedRoute = '';
  private SigninRoute = '/signin';

  private originalTarget: string;
  private originalTargetParms: string;
  private redirectFunctionParam: any;
  private origin: string;
  private redirectFunction: Function;

  constructor(private router: Router) { }

  public redirectToLogin(target = this.DefaultAuthenticatedRoute, redirectFunctionParam = null): void {
    this.origin = this.router.url;

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
        this.router.navigate([this.originalTarget], { replaceUrl: true });
      }
    } else {
      this.router.navigate([target]);
    }
  }

  public cancelRedirect(): void {
    if (this.origin) {
      this.redirectFunction = null;
      this.router.navigate([this.origin]);
    } else {
      this.router.navigate([this.DefaultAuthenticatedRoute]);
    }
  }

}
