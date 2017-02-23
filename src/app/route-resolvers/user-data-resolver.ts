import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { StateService } from '../services/state.service';

import { APIService } from '../services/api.service';

@Injectable()
export class UserDataResolver implements Resolve<any> {

  constructor(private http: Http,
              private api: APIService,
              private state: StateService) { }

  resolve(): Observable<any> {
    this.state.setLoading(true);
    return this.api.getUserData();
  }
}