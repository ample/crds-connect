/* tslint:disable:no-unused-variable */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';

import { SayHiComponent } from './say-hi.component';

import { PinService } from '../../../services/pin.service';
import { SessionService } from '../../../services/session.service';
import { RouterTestingModule } from '@angular/router/testing';
import { StateService } from '../../../services/state.service';
import { HttpModule } from '@angular/http';
import { BlandPageService } from '../../../services/bland-page.service';

import { Angulartics2 } from 'angulartics2';
import { LoginRedirectService } from '../../../services/login-redirect.service';

describe('SayHiComponent', () => {
    let fixture: ComponentFixture<SayHiComponent>;
    let comp: SayHiComponent;

    let mockPinService,
        mockLoginRedirectService,
        mockSessionService,
        mockBlandPageService,
        mockAngulartics2;

    beforeEach(() => {
        mockPinService = { sendHiEmail: jest.fn() };
        mockLoginRedirectService = { redirectToLogin: jest.fn() };
        mockSessionService = { getUserData: jest.fn() };
        mockBlandPageService = { primeAndGo: jest.fn() };
        mockAngulartics2 = { eventTrack: { next: jest.fn() }};

        TestBed.configureTestingModule({
            declarations: [
                SayHiComponent
            ],
            providers: [
                StateService,
                { provide: PinService, useValue: mockPinService },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService },
                { provide: SessionService, useValue: mockSessionService},
                { provide: Angulartics2, useValue: mockAngulartics2 },
                { provide: BlandPageService, useValue: mockBlandPageService},
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

    it('should call login redirect if not logged in', inject([Angulartics2], (angulartics2) => {
        let mockRoute = 'mockRoute';
        let sendSayHiFunc = comp['sendSayHi'];
        comp.isLoggedIn = false;
        comp.sayHi();
        expect(mockLoginRedirectService.redirectToLogin).toHaveBeenCalled();
    }));
});
