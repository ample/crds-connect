import { Angulartics2 } from 'angulartics2';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';

import { SayHiComponent } from './say-hi.component';

import { BlandPageService } from '../../../services/bland-page.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { MockTestData } from '../../../shared/MockTestData';
import { PinService } from '../../../services/pin.service';
import { SessionService } from '../../../services/session.service';

import { BlandPageDetails, BlandPageCause, BlandPageType } from '../../../models';

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
        mockAngulartics2.eventTrack.next.mockReturnValue(true);
        comp.isLoggedIn = false;
        comp['buttonText'] = 'test';
        comp.sayHi();
        expect(mockLoginRedirectService.redirectToLogin).toHaveBeenCalled();
        expect(mockAngulartics2.eventTrack.next).toHaveBeenCalledTimes(1);
        expect(mockAngulartics2.eventTrack.next).toHaveBeenCalledWith({ action: 'test Button Click', properties: { category: 'Connect' }});
    }));

    it('should init', () => {
        comp.ngOnInit();
        expect(comp['getUserDetailsThenSayHi']).toBeDefined();
    });

    it('should say hi to person', () => {
        comp['loggedIn'] = true;
        comp['isGathering'] = false;
        let user = MockTestData.getAPin(1);
        let pin = MockTestData.getAPin(2);
        comp['user'] = user;
        comp['pin'] = pin;
        let expectedBpd = new BlandPageDetails(
            'Return to map',
            `<h1 class="title">Success!</h1><p>You just said hi to ${pin.firstName} ${pin.lastName.slice(0, 1)}.</p>`,
            BlandPageType.Text,
            BlandPageCause.Success,
            ''
        );

        mockPinService.sendHiEmail.mockReturnValue(Observable.of({}));
        comp['doSayHi']();
        expect(mockPinService.sendHiEmail).toHaveBeenCalledWith(user, pin);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledTimes(1);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBpd);
    });

    it('should say hi to gathering', () => {
        comp['loggedIn'] = true;
        comp['isGathering'] = true;
        let user = MockTestData.getAPin(1);
        let pin = MockTestData.getAPin(2);
        comp['user'] = user;
        comp['pin'] = pin;
        let expectedBpd = new BlandPageDetails(
            'Return to map',
            `<h1 class="title">Host contacted</h1><p>${pin.firstName} ${pin.lastName.slice(0, 1)}. has been notified</p>`,
            BlandPageType.Text,
            BlandPageCause.Success,
            ''
        );

        mockPinService.sendHiEmail.mockReturnValue(Observable.of({}));
        comp['doSayHi']();
        expect(mockPinService.sendHiEmail).toHaveBeenCalledWith(user, pin);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledTimes(1);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBpd);
    });

    it('say hi to person should error gracefully', () => {
        comp['loggedIn'] = true;
        comp['isGathering'] = false;
        let user = MockTestData.getAPin(1);
        let pin = MockTestData.getAPin(2);
        comp['user'] = user;
        comp['pin'] = pin;
        let expectedBpd = new BlandPageDetails(
            'Return to details page',
            '<h1 class="title">Sorry!</h1><p>We are unable to send your email at this time.</p>',
            BlandPageType.Text,
            BlandPageCause.Error,
            `/person/${pin.participantId}`
        );

        mockPinService.sendHiEmail.mockReturnValue(Observable.throw({}));
        comp['doSayHi']();
        expect(mockPinService.sendHiEmail).toHaveBeenCalledWith(user, pin);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledTimes(1);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBpd);
    });

    it('say hi to gathering should error gracefully', () => {
        comp['loggedIn'] = true;
        comp['isGathering'] = true;
        let user = MockTestData.getAPin(1);
        let pin = MockTestData.getAPin(2);
        comp['user'] = user;
        comp['pin'] = pin;
        let expectedBpd = new BlandPageDetails(
            'Return to details page',
            '<h1 class="title">Sorry!</h1><p>We are unable to send your email at this time.</p>',
            BlandPageType.Text,
            BlandPageCause.Error,
            `/gathering/${pin.gathering.groupId}`
        );

        mockPinService.sendHiEmail.mockReturnValue(Observable.throw({}));
        comp['doSayHi']();
        expect(mockPinService.sendHiEmail).toHaveBeenCalledWith(user, pin);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledTimes(1);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBpd);
    });
});
