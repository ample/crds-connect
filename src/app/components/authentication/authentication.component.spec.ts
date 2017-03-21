import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { HttpModule, JsonpModule } from '@angular/http';


import { APIService } from '../../services/api.service';
import { PinService } from '../../services/pin.service';

import { LoginRedirectService } from '../../services/login-redirect.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { SessionService } from '../../services/session.service';
import { BlandPageService } from '../../services/bland-page.service';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

import { AuthenticationComponent } from './authentication.component';

describe('Component: Authentication', () => {

  let fixture: ComponentFixture<AuthenticationComponent>;
  let comp: AuthenticationComponent;
  let api: APIService;

  //api = jasmine.createSpyObj<APIService>('api', ['getRegisteredUser', 'postLogin']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthenticationComponent
      ],
      providers: [
        CookieService,
        SessionService,
        StateService,
        LoginRedirectService,
        APIService,
        PinService,
        FormBuilder,
        StoreService,
        RouterTestingModule,
        BlandPageService
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

  it('should call the router to move to the previous step', inject([LoginRedirectService], (loginRedirectService) => {
    spyOn(loginRedirectService, 'redirectToTarget');
    comp.back();
    expect((loginRedirectService.redirectToTarget).toHaveBeenCalled);
  }));

  function setForm(email, password) {
    comp.form.setValue({ email: email, password: password });
  }

  it('loginException should get set to true', inject([APIService], (api) => {
    setForm('bad@bad.com', 'reallynotgood');
    comp.form.markAsDirty();
    spyOn(api, 'postLogin').and.returnValue(Observable.throw({}));
    expect(comp.loginException).toBeFalsy();
    comp.submitLogin();
    expect(comp.loginException).toBeTruthy();
  }));

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


});


