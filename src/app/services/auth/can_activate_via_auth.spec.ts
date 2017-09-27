import { AuthService } from './auth.service';
import { ReactiveAuth } from 'crds-reactive-auth';
import {Observable} from 'rxjs/Observable';
import { TestBed, async, inject} from '@angular/core/testing';
import { CanActivateViaAuth } from './can_activate_via_auth';
import { RouterTestingModule } from '@angular/router/testing';

class StubAuthService {
  isAuthenticated = true;
  watch = () => Observable.create(observer => {
    observer.next({
      detail: {
        message: 'Auth Cookie Updated',
        oldValue: 'oldValue',
        currentValue: 'newValue'
      }
    });
  })
}

class StubNonAuthService {
  isAuthenticated = false;
  watch = () => Observable.create(observer => {
    observer.next({
      detail: {
        message: 'Auth Cookie Expired',
        oldValue: 'oldValue',
        currentValue: ''
      }
    });
  })
}



describe('Authentication Router Guard', () => {
  describe( 'Cookie updated', () => {
    beforeEach(async(() => {
     TestBed.configureTestingModule({
        providers: [
          {provide: AuthService, useClass: StubAuthService},
          CanActivateViaAuth
        ]
      });
    }));

    it('should be authenticated', inject([CanActivateViaAuth, AuthService],
      (canActivate: CanActivateViaAuth, stubAuthService: AuthService) => {
      expect(canActivate.canActivate()).toBe(true);
    }));
  });

  describe('Cookie Expired', () => {
    beforeEach(async(() => {
     TestBed.configureTestingModule({
        providers: [
          {provide: AuthService, useClass: StubNonAuthService},
          CanActivateViaAuth
        ]
      });
    }));

    it('should not be authenticated', inject([CanActivateViaAuth, AuthService],
      (canActivate: CanActivateViaAuth, stubAuthService: AuthService) => {
        expect(canActivate.canActivate()).toBe(false);
    }));

  });
});

