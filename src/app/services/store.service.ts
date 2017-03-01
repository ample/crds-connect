import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';
import { SessionService } from './session.service';
import { StateService } from './state.service';

@Injectable()
export class StoreService {

  public url: string = '';
  private queryParams: Object;

  // user info
  public email: string = '';
  public isGuest: boolean = false;
  public reactiveSsoTimer: any;
  public reactiveSsoTimeOut: number = 3000;
  public reactiveSsoLoggedIn: boolean = false;

  constructor(
    private api: APIService,
    private route: ActivatedRoute,
    private state: StateService,
    private zone: NgZone,
    public session: SessionService
  ) {
    this.processQueryParams();
    this.preloadData();
    this.enableReactiveSso();
  }

  public enableReactiveSso() {
    if (this.session.hasToken()) {
      this.reactiveSsoLoggedIn = true;
    }
    this.disableReactiveSso();
    this.zone.runOutsideAngular(() => {
      this.reactiveSsoTimer = setInterval(() => {
        this.zone.run(() => {
          this.performReactiveSso();
        });
      }, this.reactiveSsoTimeOut);
    });
  }

  public performReactiveSso() {
    if (this.session.hasToken() && this.reactiveSsoLoggedIn === false) {

      this.reactiveSsoLoggedIn = true;
      this.loadUserData();

    } else if (!this.session.hasToken() && this.reactiveSsoLoggedIn === true) {

      this.reactiveSsoLoggedIn = false;
      this.email = '';

    }
  }

  public disableReactiveSso() {
    clearInterval(this.reactiveSsoTimer);
  }


  public loadUserData(): void {
    this.api.getAuthentication().subscribe(
      (info) => {
        if (info !== null) {
          this.email = info.userEmail;
        } else {
          this.api.logOut();
        }
      }
    );
  }

  public loadEmail(): any {
    this.api.getAuthentication().subscribe((info) => {
      if (info !== null) {
        return info.userEmail;
      }
    }, () => {
      return null;
    });
  }

  public preloadData(): void {
    if (this.api.isLoggedIn()) {
      // this.state.hidePage(this.state.authenticationIndex);
      this.loadUserData();
    }
  }

  private processQueryParams(): void {
    this.queryParams = this.route.snapshot.queryParams;
    if (this.queryParams['theme'] === 'dark') {
      this.setTheme('dark-theme');
    }
  }

  private setTheme(theme): void {
    document.body.classList.add(theme);
  }


}
