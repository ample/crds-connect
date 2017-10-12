import { AnalyticsService } from '../../../services/analytics.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SayHiComponent } from './say-hi.component';

import { BlandPageService } from '../../../services/bland-page.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';
import { SayHiService } from '../../../services/say-hi.service';

describe('SayHiComponent', () => {
  let fixture: ComponentFixture<SayHiComponent>;
  let comp: SayHiComponent;

  let mockSayHiService, mockLoginRedirectService, mockSessionService, mockBlandPageService, mockAnalytics;

  beforeEach(() => {
    mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['redirectToLogin']);
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getUserData']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);
    mockAnalytics = jasmine.createSpyObj<AnalyticsService>('analytics', ['sayHiButtonPressed']);
    mockSayHiService = jasmine.createSpyObj<SayHiService>('sayHiService', ['sendHiEmail']);

    TestBed.configureTestingModule({
      declarations: [SayHiComponent],
      providers: [
        StateService,
        { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: AnalyticsService, useValue: mockAnalytics },
        { provide: SayHiService, useValue: mockSayHiService }
      ],
      imports: [RouterTestingModule.withRoutes([])],

      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(
    async(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(SayHiComponent);
        comp = fixture.componentInstance;
      });
    })
  );

  it('should create an instance', () => {
    expect(comp).toBeTruthy();
  });

  it('should call login redirect if not logged in', () => {
    let mockRoute = 'mockRoute';
    let sendSayHiFunc = comp['sendSayHi'];
    comp.isLoggedIn = false;
    comp.sayHi();
    expect(mockLoginRedirectService.redirectToLogin).toHaveBeenCalled();
  });

  it('should doSayHi if logged in and call analytics', () => {
    comp['isLoggedIn'] = true;
    comp['buttonText'] = 'BackInTheDayItsLikeCatsCatsCats';
    spyOn(comp, 'doSayHi');
    comp.sayHi();
    expect(comp['doSayHi']).toHaveBeenCalled();
    expect(mockAnalytics.sayHiButtonPressed).toHaveBeenCalledWith(
      'BackInTheDayItsLikeCatsCatsCats Button Click',
      'Connect'
    );
  });

  xit('should getUserDetailsThenSayHi in person mode', () => {
    // TODO
  });

  xit('should getUserDetailsThenSayHi in gathering mode', () => {
    // TODO
  });

  xit('should doSayHi', () => {
    // TODO
  });
});
