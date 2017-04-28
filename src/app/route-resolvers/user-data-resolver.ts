import { BlandPageService } from '../services/bland-page.service';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { StateService } from '../services/state.service';
import { BlandPageCause, BlandPageDetails, BlandPageType, Pin } from '../models';

import { SessionService } from '../services/session.service';

@Injectable()
export class UserDataResolver implements Resolve<Pin> {

  constructor(private http: Http,
              private session: SessionService,
              private state: StateService,
              private blandPageService: BlandPageService) { }

  resolve(): Observable<Pin> {
    this.state.setLoading(true);
      return this.session.getUserData()
      .catch((err: Response, caught: Observable<Pin>) => {
        if (err !== undefined) {
          let pinResolverError = new BlandPageDetails(
            'Back To The Map',
            'Unable to get user details',
            BlandPageType.Text,
            BlandPageCause.Error,
            '',
            ''
          );
          this.blandPageService.primeAndGo(pinResolverError);
          return Observable.throw('Unable to get user details');
        }
        return Observable.throw(caught);
      });
  }
}
