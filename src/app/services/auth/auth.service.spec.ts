import { AuthService } from './auth.service';
import {Observable} from 'rxjs/Observable';
import { TestBed, async, inject} from '@angular/core/testing';
import { ReactiveAuth } from 'crds-reactive-auth';

class FakeReactiveAuth {
  public cookieName: String;
  public cookieVal: String;

  constructor(cookieName) {
    this.cookieName = cookieName;
    this.cookieVal = '';
  }

  subscribe = (timeout: number, onUpdate, onExpired) => {
    setInterval( () => {
      onUpdate({
        detail: {
          currentValue: 'validToken',
          oldValue: ''
        }
      });
    } , 100);
  }
}

class FakeReactiveAuthExpire {
  public cookieName: String;
  public cookieVal: String;

  constructor(cookieName) {
    this.cookieName = cookieName;
    this.cookieVal = 'validToken';
  }

  subscribe = (timeout: number, onUpdate, onExpired) => {
    setInterval( () => {
      onUpdate({
        detail: {
          currentValue: '',
          oldValue: 'validToken'
        }
      });
    } , 100);
  }
}

const fakeReactiveAuth = new FakeReactiveAuth('sessionId');
const fakeReactiveAuthExpired = new FakeReactiveAuthExpire('sessionId');

describe('AuthService', () => {

  describe('Validate cookie', () => {
    const fakeAuthServiceFactory = () => {
      const reactiveAuth = fakeReactiveAuth;
      return new AuthService(reactiveAuth as ReactiveAuth);
    };

    let fixture: AuthService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useFactory: fakeAuthServiceFactory, deps: [] }
        ]
      });

      fixture = TestBed.get(AuthService);
    }));


    it('should set authenticated to false when there is no cookieVal', () => {
      expect(fixture.isAuthenticated).toBe(false);
    });

    it('should start watching and then authenticate', (done: Function) => {
      expect(fixture.isAuthenticated).toBe(false);
      fixture.watch().subscribe( (evt) => {
        expect(evt.detail.currentValue).toBe('validToken');
        expect(fixture.isAuthenticated).toBeTruthy();
        done();
      });
    });
  });

  describe('Invalidate Token', () => {
    const fakeAuthServiceFactory = () => {
      const reactiveAuth = fakeReactiveAuthExpired;
      return new AuthService(reactiveAuth as ReactiveAuth);
    };

    let fixture: AuthService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useFactory: fakeAuthServiceFactory, deps: [] }
        ]
      });

      fixture = TestBed.get(AuthService);
    }));

    it('should set authenticated to true when there is a valid cookie', () => {
      expect(fixture.isAuthenticated).toBe(true);
    });

    it('should start watching and then unauthenticate when the cookie is an empty string', (done: Function) => {
      expect(fixture.isAuthenticated).toBe(true);
      fixture.watch().subscribe( (evt) => {
        expect(evt.detail.currentValue).toBe('');
        expect(fixture.isAuthenticated).toBeFalsy();
        done();
      });
    });
  });
});
