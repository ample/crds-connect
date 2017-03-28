/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SayHiComponent } from './say-hi.component';

import { PinService } from '../../../services/pin.service';
import { SessionService } from '../../../services/session.service';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { StateService } from '../../../services/state.service';
import { HttpModule, JsonpModule } from '@angular/http';
import { BlandPageService } from '../../../services/bland-page.service';


import { Angulartics2 } from 'angulartics2';
import { ReactiveFormsModule } from '@angular/forms';

import { Participant } from '../../../models/participant';
import { Inquiry } from '../../../models/inquiry';
import { GroupService } from '../../../services/group.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { Observable } from 'rxjs/Rx';

describe('SayHiComponent', () => { 
    let fixture: ComponentFixture<SayHiComponent>;
    let comp: SayHiComponent;

    let mockPinService, mockLoginRedirectService, mockSessionService, mockBlandPageService;

    beforeEach(() => {
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['sendHiEmail']);
        mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['redirectToLogin']);
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getUserData']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);

        TestBed.configureTestingModule({
            declarations: [
                SayHiComponent
            ],
            providers: [
                { provide: PinService, useValue: mockPinService },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService },
                { provide: SessionService, useValue: mockSessionService},
                { provide: BlandPageService, useValue: mockBlandPageService},
                {
                    provide: Router,
                    useValue: { routerState: { snapshot: { url: 'abc123' } } },
                }
            ],
            imports: [RouterTestingModule.withRoutes([]), HttpModule],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SayHiComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should call login redirect if not logged in', () => {

        let mockRoute = "mockRoute";
        let sendSayHiFunc = comp['sendSayHi'];
        comp.isLoggedIn = false;
        comp.sayHi();
        expect(mockLoginRedirectService.redirectToLogin).toHaveBeenCalled();

    });
});
