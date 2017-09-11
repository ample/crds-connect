import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SessionService } from './session.service';
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
    private session: SessionService,
    private route: ActivatedRoute,
    private state: StateService
  ) {
    this.processQueryParams();
    this.preloadData();
  }

  public loadUserData(): void {
    this.session.getAuthentication().subscribe(
      (info) => {
        if (info !== null) {
          this.email = info.userEmail;
        } else {
          this.session.logOut();
        }
      }
    );
  }

  public preloadData(): void {
    if (this.session.isLoggedIn()) {
      this.loadUserData();
    }
  }

  private processQueryParams(): void {
    this.queryParams = this.route.snapshot.queryParams;
    if (this.queryParams['theme'] === 'dark') {
      this.setTheme('dark-theme');
    }
  }

  private setTheme(theme: string): void {
    document.body.classList.add(theme);
  }

  public preSubmit(event: Event, noBlur = false) {
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
