
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { APIService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { ValidationService } from '../services/validation.service';

import { RegisterComponent } from './register.component';

describe('Component: Registration', () => {
  let fixture: RegisterComponent,
      router: Router,
      fb: FormBuilder,
      state: StateService,
      api: APIService,
      store: StoreService,
      validation: ValidationService;

  beforeEach(() => {

    router = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);
    state = jasmine.createSpyObj<StateService>(
      'state',
      [
        'getNextPageToShow',
        'getPrevPageToShow',
        'hidePage',
        'setLoading'
      ]
    );
    fb = new FormBuilder();
    validation = new ValidationService();
    api = jasmine.createSpyObj<APIService>('api', ['postLogin', 'postUser']);
    fixture = new RegisterComponent(api, fb, router, state, store, validation);
    fixture.ngOnInit();
  });

  function setForm( firstName, lastName, email, password ) {
    fixture.regForm = new FormGroup({
      firstName: new FormControl(firstName, Validators.required),
      lastname: new FormControl(lastName, Validators.required),
      email: new FormControl(email, Validators.required),
      password: new FormControl(password)
    });
  }

  describe('#ngOnInit', () => {
    it('initializes the component', () => {
      expect(fixture).toBeTruthy();
    });
  });

  describe('#adv', () => {
    xit('should call the router to move to the next step', () => {
      fixture.adv();
      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });


  describe('#submit User', () => {

    it('should not process if form is invalid', () => {
      let didSubmit = fixture.submitRegistration();
      expect(didSubmit).toBe(false);
    });
  });


  describe('#formatErrorMessage', () => {
    it('should return <u>required</u> when errors.required !== undefined', () => {
      let errors = { required: true };

      let res = fixture.switchMessage(errors);
      expect(res).toBe('is <u>required</u>');
    });

    it('should return <em>invalid</em> when errors.required === undefined', () => {
      let errors = { require: undefined };

      let res = fixture.switchMessage(errors);
      expect(res).toBe('is <em>invalid</em>');
    });
  });

  describe('#next', () => {
    describe('when form is invalid', () => {
      beforeEach(() => {
        setForm('Bob', '', 'good@g.com', 'foobar');
      });

      it('should not call #adv', () => {
        spyOn(fixture, 'adv');

        fixture.submitRegistration();
        expect(fixture.adv).not.toHaveBeenCalled();
      });
    });

    describe('when invalid credentials are submitted', () => {
      beforeEach(() => {
        setForm('Bob', '', 'good@g.com', 'foobar');
        (<jasmine.Spy>api.postLogin).and.returnValue(Observable.throw({}));
      });

      it('#adv should not get called', () => {
        spyOn(fixture, 'adv');
      });
    });

  });
});
