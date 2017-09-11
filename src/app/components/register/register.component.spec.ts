
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { AnalyticsService } from '../../services/analytics.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { SessionService } from '../../services/session.service';

import { RegisterComponent } from './register.component';

describe('Component: Registration', () => {
    let fixture: ComponentFixture<RegisterComponent>;
    let comp: RegisterComponent;
    let mockRouter,
        mockSessionService,
        mockStateService,
        mockFormBuilder,
        mockStoreService,
        mockLoginRedirectService,
        mockAnalyticsService;

  beforeEach(() => {
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['postLogin']);
        mockStateService = jasmine.createSpyObj<StateService>('st', ['getNextPageToShow', 'getPrevPageToShow', 'hidePage', 'setLoading']);
        mockFormBuilder = jasmine.createSpyObj<FormBuilder>('formBuilder', ['constructor']);
        mockStoreService = jasmine.createSpyObj<StoreService>('storeService', ['loadUserData']);
        mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['']);
        mockAnalyticsService = jasmine.createSpyObj<AnalyticsService>('analyticsService', ['identifyLoggedInUser', 'newUserRegistered']);

        TestBed.configureTestingModule({
            declarations: [
                RegisterComponent
            ],
            imports: [],
            providers: [
                { provide: SessionService, useValue: mockSessionService },
                { provide: StateService, useValue: mockStateService },
                { provide: Router, useValue: mockRouter },
                { provide: FormBuilder, useValue: mockFormBuilder },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService },
                { provide: StoreService, useValue: mockStoreService },
                { provide: AnalyticsService, useValue: mockAnalyticsService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
  });

      beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
          fixture = TestBed.createComponent(RegisterComponent);
          comp = fixture.componentInstance;
       });
    }));

  function setForm( firstName, lastName, email, password ) {
    comp.regForm = new FormGroup({
      firstName: new FormControl(firstName, Validators.required),
      lastName: new FormControl(lastName, Validators.required),
      email: new FormControl(email, Validators.required),
      password: new FormControl(password)
    });
  }

  describe('#ngOnInit', () => {
    it('initializes the component', () => {
      expect(comp).toBeTruthy();
    });
  });

  describe('#adv', () => {
    xit('should call the router to move to the next step', () => {
      comp.adv();
      expect(mockRouter.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe('logInNewUser', () => {
    it('should call analytics', () => {
      spyOn(comp, 'adv');
      setForm('Bob', 'Barker', 'good@g.com', 'foobar');
      mockSessionService.postLogin.and.returnValue(Observable.of({userId: 1234}));
      comp.loginNewUser('email@email.com', 'supersecret');
      expect(mockAnalyticsService.newUserRegistered).toHaveBeenCalledWith(1234);
      expect(mockAnalyticsService.identifyLoggedInUser).toHaveBeenCalledWith(1234, 'good@g.com', 'Bob', 'Barker');
      expect(comp.adv).toHaveBeenCalled();
    });
  });


  describe('#submit User', () => {
      beforeEach(() => {
        setForm('Bob', '', 'good@g.com', 'foobar');
      });
    it('should not process if form is invalid', () => {
      let didSubmit = comp.submitRegistration();
      expect(didSubmit).toBe(false);
    });
  });


  describe('#formatErrorMessage', () => {
   it('should return <u>required</u> when errors.required !== undefined', () => {
      let errors = { required: true };

      let res = comp.switchMessage(errors);
      expect(res).toBe('is <u>required</u>');
    });

    it('should return <em>invalid</em> when errors.required === undefined', () => {
      let errors = { require: undefined };

      let res = comp.switchMessage(errors);
      expect(res).toBe('is <em>invalid</em>');
    });
  });

  describe('#next', () => {
    describe('when form is invalid', () => {
      beforeEach(() => {
        setForm('Bob', '', 'good@g.com', 'foobar');
      });

      it('should not call #adv', () => {
        spyOn(comp, 'adv');

        comp.submitRegistration();
        expect(comp.adv).not.toHaveBeenCalled();
      });
    });

    describe('when invalid credentials are submitted', () => {
      beforeEach(() => {
        setForm('Bob', '', 'good@g.com', 'foobar');
        (mockSessionService.postLogin).and.returnValue(Observable.throw({}));
      });

      it('#adv should not get called', () => {
        spyOn(comp, 'adv');
      });
    });

  });
});
