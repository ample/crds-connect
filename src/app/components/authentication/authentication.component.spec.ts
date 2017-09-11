import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { HttpModule, JsonpModule } from '@angular/http';

import { AnalyticsService } from '../../services/analytics.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { SessionService } from '../../services/session.service';

import { AuthenticationComponent } from './authentication.component';

describe('Component: Authentication', () => {

  let fixture: ComponentFixture<AuthenticationComponent>;
  let comp: AuthenticationComponent;
  let mockAnalyticsService,
    mockSessionService,
    mockStateService,
    mockLoginRedirectService,
    mockStoreService;

  beforeEach(() => {
    mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('redirectService', ['cancelRedirect', 'redirectToTarget']);
    mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['postLogin']);
    mockStateService = jasmine.createSpyObj<StateService>('stateService', ['setLoading']);
    mockStoreService = jasmine.createSpyObj<StoreService>('storeService', ['loadUserData']);
    mockAnalyticsService = jasmine.createSpyObj<AnalyticsService>('analyticsService', ['alias', 'identify']);

    TestBed.configureTestingModule({
      declarations: [
        AuthenticationComponent
      ],
      providers: [
        { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        FormBuilder,
        { provide: SessionService, useValue: mockSessionService },
        { provide: StateService, useValue: mockStateService },
        { provide: StoreService, useValue: mockStoreService },
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ],
      imports: [RouterTestingModule.withRoutes([]), HttpModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(AuthenticationComponent);
      comp = fixture.componentInstance;
      comp.ngOnInit();
    });
  }));

  it('should initialize the component', () => {
    expect(fixture).toBeTruthy();
  });

  it('should call the router to move to the previous step', () => {
    comp.back();
    expect(comp.redirectService.cancelRedirect).toHaveBeenCalled();
  });

  it('should set the "navigatedBackToNeighbors" prop on state service',
    () => {
      comp.state.navigatedBackToNeighbors = false;
      let ret = comp.back();
      expect(ret).toEqual(false);
      expect(comp.redirectService.cancelRedirect).toHaveBeenCalled();
      expect(comp.state.navigatedBackToNeighbors).toEqual(true);

    });

  function setForm(email, password) {
    comp.form.setValue({ email: email, password: password });
  }

  it('should submit login successfully', () => {
    comp.form.setValue({email: 'email@user.com', password: 'password'});
    mockSessionService.postLogin.and.returnValue(Observable.of({userId: 1234}));
    comp.submitLogin();
    expect(mockAnalyticsService.identify).toHaveBeenCalledWith(1234);
    expect(mockLoginRedirectService.redirectToTarget).toHaveBeenCalled();
    expect(mockStoreService.loadUserData).toHaveBeenCalled();
  });

  it('loginException should get set to true', () => {
    setForm('bad@bad.com', 'reallynotgood');
    comp.form.markAsDirty();
    (<jasmine.Spy>comp.session.postLogin).and.returnValue(Observable.throw({}));
    expect(comp.loginException).toBeFalsy();
    comp.submitLogin();
    expect(comp.loginException).toBeTruthy();
  });

  it('should check to see if field is valid when valid credentials are provided', () => {
    setForm('s@s.com', 'test');
    let isInvalid = comp.formInvalid('email');
    expect(isInvalid).toBe(false);
  });

  it('should check to see if field is invalid when invalid credentials are provided', () => {
    setForm('sm', 'test');
    let isInvalid = comp.formInvalid('email');
    expect(isInvalid).toBe(true);
  });

  it('should call cancelRedirect when the back button is clicked', () => {
    comp.back();
    expect(comp.redirectService.cancelRedirect).toHaveBeenCalled();
  });

});
