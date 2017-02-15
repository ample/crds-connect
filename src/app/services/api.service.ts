import { Injectable, NgZone } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SessionService } from './session.service';

import { IFrameParentService } from './iframe-parent.service';
import { LookupTable } from '../models/lookup-table';
import { User } from '../models/user';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class APIService {

  private baseUrl = process.env.CRDS_API_ENDPOINT;

  public restVerbs = {
    post: 'POST',
    put: 'PUT'
  };

  public defaults = {
    authorized: null
  };

  constructor( private http: Http,
               private session: SessionService) { }

  public getAuthentication(): Observable<any> {
    return this.session.get(this.baseUrl + 'api/v1.0.0/authenticated')
      .map((res: Response) => {
        return res || this.defaults.authorized;
      })
      .catch((res: Response) => {
        return [this.defaults.authorized];
      });
  }

  public getRegisteredUser(email: string): Observable<boolean> {
    return this.http.get(this.baseUrl + 'api/lookup/0/find/?email=' + encodeURIComponent(email))
      .map(res => { return false; })
      .catch(res => { return [true]; });
  };

  public getStateList(): Observable<any> {
    return this.session.get(this.baseUrl + 'api/lookup/states')
        .map((res: Array<LookupTable>) => {
          return res;
        })
        .catch( (err) => Observable.throw(err.json().error) );
  }

  public postLogin(email: string, password: string): Observable<any> {
    let body = {
      'username': email,
      'password': password
    };
    return this.session.post(this.baseUrl + 'api/login', body)
      .map((res: Response) => {
        return res || this.defaults.authorized;
      })
      .catch(this.handleError);
  }

  public postUser(user: User): Observable<any> {
    return this.session.post(this.baseUrl + 'api/user', user)
      .map(this.extractData)
      .catch(this.handleError);
  };

  private extractData(res: Response) {
    let body: any = res;
    if (typeof res.json === 'function') {
      body = res.json();
    }
    return body;
  };

  private handleError(err: Response | any) {
    return Observable.throw(err);
  };

  public isLoggedIn(): boolean {
    return this.session.hasToken();
  }

  public logOut(): void {
    this.session.clearTokens();
    return;
  }

}
