import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Injectable()
export class LoginRedirectService {
  private DefaultAuthenticatedRoute = '/host-signup';
  private SigninRoute = '/signin';

  private originalTarget: string;
  private originalTargetParms: string;

  constructor(private router: Router) { }

  public redirectToLogin(target = this.DefaultAuthenticatedRoute, queryParm = null): void {
    this.originalTarget = target;
    queryParm ? this.originalTargetParms = queryParm : null;
    this.router.navigate([this.SigninRoute]);
  }

  public redirectToTarget(target = this.DefaultAuthenticatedRoute): void {
    if (this.originalTarget) {
      if (this.originalTargetParms) {
        let navigationExtras: NavigationExtras = {
          queryParams: { 'q': this.originalTargetParms }
        };
        this.router.navigate([this.originalTarget], navigationExtras);
      }
      else {
        this.router.navigate([this.originalTarget]);
      }
    } else {
      this.router.navigate([target]);
    }
  }
}
