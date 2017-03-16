import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { APIService } from './api.service';
import { StateService } from './state.service';

@Injectable()
export class StoreService {

  public url: string = '';
  private queryParams: Object;

  // user info
  public email: string = '';
  public isGuest: boolean = false;
  public previousGiftAmount: string = '';


  constructor(
    private api: APIService,
    private route: ActivatedRoute,
    private state: StateService
  ) {
    this.processQueryParams();
    this.preloadData();
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

  public preSubmit(event, noBlur = false) {
    event.preventDefault();
    if (noBlur === false) {
      this.blurInputField(event);
    }
  }

  public blurInputField(event) {
    if (event.target !== undefined) {
      event.target.blur();
    } else if (event.srcElement !== undefined) {
      event.srcElement.blur();
    } else if (event.originalTarget !== undefined) {
      event.originalTarget.blur();
    }
  }

}
