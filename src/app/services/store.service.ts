import { Injectable, NgZone } from '@angular/core';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
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
  public contactId: string = (process.env.CRDS_ENV || '') + 'contactId';
  public email: string = '';
  public isGuest: boolean = false;
  public reactiveSsoTimer: any;
  public reactiveSsoTimeOut: number = 3000;
  public reactiveSsoLoggedIn: boolean = false;

  constructor(
    private api: APIService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private state: StateService,
    private zone: NgZone,
    public session: SessionService
  ) {
    this.processQueryParams();
    this.preloadData();
  }

  public loadUserData(): void {
    this.api.getAuthentication().subscribe(
      (info) => {
        if (info !== null) {
          this.email = info.userEmail;
          this.contactId = info.userId;
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

  public loadContactId(): any {
    if (this.cookieService.get(this.contactId) !== null) {
      return +this.cookieService.get(this.contactId);
    }
    this.api.getAuthentication().subscribe((info) => {
      if (info !== null) {
        this.setContactId(info.userId);
        return info.userId;
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
  }

  public setContactId(contactId: string): void {
    this.cookieService.put(this.contactId, contactId, this.session.cookieOptions);
  }


}
