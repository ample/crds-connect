import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { APIService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { ValidationService } from '../services/validation.service';

import { AuthenticationComponent } from './authentication.component';

describe('Component: Authentication', () => {

  let fixture: AuthenticationComponent,
      router: Router,
      stateService: StateService,
      store: StoreService,
      fb: FormBuilder,
      api: APIService,
      validation: ValidationService;

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
    validation = new ValidationService();
    fixture = new AuthenticationComponent(
      api,
      fb,
      router,
      stateService,
      store,
      validation
    );
    fixture.ngOnInit();
  });

  function setForm( email, password ) {
    fixture.form.setValue({ email: email, password: password});
  }

  function setGuestForm( email ) {
    fixture.formGuest.setValue({ email: email });
    fixture.email = email;
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

    describe('when valid auth credentials are submitted', () => {
      it('should call #adv when valid auth credentials are submitted', () => {
        setForm('good@good.com', 'foobar');
        fixture.form.markAsDirty();
        (<jasmine.Spy>api.postLogin).and.returnValue(Observable.of({}));
        spyOn(fixture, 'adv');
        fixture.submitLogin();
        expect(fixture.adv).toHaveBeenCalled();
      });
    });
  });
});
