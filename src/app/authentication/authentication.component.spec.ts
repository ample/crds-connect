import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { APIService } from '../services/api.service';
import { LoginRedirectService } from '../shared/services/login-redirect.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';

import { AuthenticationComponent } from './authentication.component';

describe('Component: Authentication', () => {

  let fixture: AuthenticationComponent,
      router: Router,
      redirectService: LoginRedirectService,
      stateService: StateService,
      store: StoreService,
      fb: FormBuilder,
      api: APIService;

  beforeEach(() => {

    api = jasmine.createSpyObj<APIService>('api', ['getRegisteredUser', 'postLogin']);
    fb = new FormBuilder();
    router = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);
    stateService = jasmine.createSpyObj<StateService>(
      'stateService',
      [
        'getNextPageToShow',
        'getPrevPageToShow',
        'hidePage',
        'setLoading'
      ]
    );
    store = jasmine.createSpyObj<StoreService>(
      'store', [
        'loadUserData',
        'validateRoute'
      ]
    );
    fixture = new AuthenticationComponent(
      api,
      fb,
      router,
      redirectService,
      stateService,
      store
    );
    fixture.ngOnInit();
  });

  function setForm( email, password ) {
    fixture.form.setValue({ email: email, password: password});
  }

  describe('#ngOnInit', () => {
    it('should initialize the component', () => {
      expect(fixture).toBeTruthy();
    });
  });

  describe('#adv', () => {
    xit('should call the router to move to the next step', () => {
      fixture.adv();
      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe('#back', () => {
    xit('should call the router to move to the previous step', () => {
      fixture.back();
      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe('#formInvalid(field)', () => {
    it('should check to see if field is valid when valid credentials are provided', () => {
      setForm('s@s.com', 'test');
      let isInvalid = fixture.formInvalid('email');
      expect(isInvalid).toBe(false);
    });

    it('should check to see if field is invalid when invalid credentials are provided', () => {
      setForm('sm', 'test');
      let isInvalid = fixture.formInvalid('email');
      expect(isInvalid).toBe(true);
    });
  });

  describe('#next', () => {
    describe('when form is invalid', () => {
      beforeEach(() => {
        setForm('good@', 'foobar');
        fixture.form.markAsDirty();
      });

      it('#adv should not get called', () => {
        spyOn(fixture, 'adv');

        fixture.submitLogin();
        expect(fixture.adv).not.toHaveBeenCalled();
      });

      it('loginException should get set to true', () => {
        expect(fixture.loginException).toBeFalsy();
        fixture.submitLogin();
        expect(fixture.loginException).toBeTruthy();
      });
    });

    describe('when invalid auth credentials are submitted', () => {
      beforeEach(() => {
        setForm('bad@bad.com', 'reallynotgood');
        fixture.form.markAsDirty();
        (<jasmine.Spy>api.postLogin).and.returnValue(Observable.throw({}));
      });

      it('#adv should not get called', () => {
        spyOn(fixture, 'adv');
        fixture.submitLogin();
        expect(fixture.adv).not.toHaveBeenCalled();
      });

      it('loginException should get set to true', () => {
        expect(fixture.loginException).toBeFalsy();
        fixture.submitLogin();
        expect(fixture.loginException).toBeTruthy();
      });
    });

// No longer using adv function - now using redirectService
    // describe('when valid auth credentials are submitted', () => {
    //   it('should call #adv when valid auth credentials are submitted', () => {
    //     setForm('good@good.com', 'foobar');
    //     fixture.form.markAsDirty();
    //     (<jasmine.Spy>api.postLogin).and.returnValue(Observable.of({}));
    //     spyOn(fixture, 'adv');
    //     fixture.submitLogin();
    //     expect(fixture.adv).toHaveBeenCalled();
    //   });
    // });
  });
});
