/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ListEntryComponent } from './list-entry.component';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { MockComponent } from '../../shared/mock.component';

import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, RequestOptions, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';
import { LoginRedirectService } from '../../services/login-redirect.service';

describe('ListEntryComponent', () => {
    let fixture: ComponentFixture<ListEntryComponent>;
    let comp: ListEntryComponent;
    let router: Router;
    let el;
    let mockStateService, mockSessionService, mockCookieService, mockLoginRedirectService;

    beforeEach(() => {
        class RouterStub {
            navigate(url: string) { return url; }
        }

        mockStateService = jasmine.createSpyObj<StateService>('stateService', ['constructor']);
        mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['constructor']);
        mockCookieService = jasmine.createSpyObj<CookieService>('cookieService', ['constructor']);
        mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['constructor']);

        TestBed.configureTestingModule({
            declarations: [
                ListEntryComponent,
                MockComponent({selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass']})
            ],
            providers: [
                MockBackend,
                BaseRequestOptions,
                { provide: StateService, useValue: mockStateService },                
                { provide: SessionService, useValue: mockSessionService },
                { provide: CookieService, useValue: mockCookieService },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService },
                {
                  provide: Http,
                  useFactory: (backend, options) => new Http(backend, options),
                  deps: [MockBackend, BaseRequestOptions]
                },
                { provide: Router, useClass: RouterStub }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ListEntryComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should return proper name format', () => {
        fixture.detectChanges();
        comp.firstName = 'Bob';
        comp.lastName = 'Johnson';
        expect(comp.name()).toBe('BOB J.');
    });

    it('should return proper count string', () => {
        fixture.detectChanges();
        comp.participantCount = 10;
        expect(comp.count()).toBe('10 OTHERS');
    });
});
