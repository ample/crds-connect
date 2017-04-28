import { BlandPageService } from '../services/bland-page.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { StateService } from '../services/state.service';
import { BlandPageType, BlandPageDetails, BlandPageCause } from '../models';
import { SessionService } from '../services/session.service';

@Injectable()
export class DetailedUserDataResolver implements Resolve<any> {

  constructor(private session: SessionService,
              private state: StateService,
              private blandPageService: BlandPageService) { }

  resolve(): Observable<any> {
    this.state.setLoading(true);

    return this.session.getDetailedUserData()
    .catch((err: Response, caught: Observable<any>) => {
        if (err !== undefined) {
          let pinResolverError = new BlandPageDetails(
            'Back To The Map',
            'Unable to get user profile data',
            BlandPageType.Text,
            BlandPageCause.Error,
            '',
            ''
          );
          this.blandPageService.primeAndGo(pinResolverError);
          return Observable.throw('Unable to get user profile data');
        }
        return Observable.throw(caught);
      });
  }
}
