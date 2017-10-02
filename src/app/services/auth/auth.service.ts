import ReactiveAuth from 'crds-reactive-auth/src';
import {Observable} from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
  reactiveAuth: ReactiveAuth;
  authObs: Observable<any>;
  sessionId: string;
  isAuthenticated: boolean;

  constructor(reactiveAuth: ReactiveAuth) {
    this.reactiveAuth = reactiveAuth;
    if (this.reactiveAuth.cookieVal === '' || this.reactiveAuth.cookieVal === undefined) {
      this.isAuthenticated = false;
    } else {
      this.isAuthenticated = true;
    }
  };

  watch(): Observable<any> {
    if (this.authObs) {
      return this.authObs;
    }

    this.authObs = Observable.create( observer => {

      const onUpdate = (evt) => {
        this.sessionId = evt.detail.currentValue;
        observer.next(evt);
      };

      const onExpired = (evt) => {
        this.sessionId = null;
        observer.next(evt);
      };

      this.reactiveAuth.subscribe(3000, onUpdate, onExpired);
    });
    this.authObs.subscribe(
      evt => {
        if ( evt.detail.currentValue === '' || evt.detail.currentValue === undefined ) {
          this.isAuthenticated = false;
        } else {
          this.isAuthenticated = true;
        }
      },
      err => {},
      () => {});
    return this.authObs;
  }
}
