import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { APIService } from '../services/api.service';

@Injectable()
export class StateListResolver implements Resolve<any> {

  constructor(private http: Http,
              private api: APIService) { }

    resolve(): Observable<any> {
      return this.api.getStateList();
    }
}