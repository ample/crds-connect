import { pinType } from '../../models/pin';
import { PinIdentifier } from '../../models/pin-identifier';
import { error } from 'util';
import { Observable } from 'rxjs/Rx';
import { BlandPageDetails } from '../../models/bland-page-details';
import { ActivatedRoute, Router } from '@angular/router';
import { BlandPageService } from '../../services/bland-page.service';
import { GroupService } from '../../services/group.service';
import { PinService } from '../../services/pin.service';
/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MockTestData } from '../../shared/MockTestData';

import { HandleInviteComponent } from './handle-invite.component';

import { StateService } from '../../services/state.service';

describe('HandleInviteComponent', () => {
    let fixture: ComponentFixture<HandleInviteComponent>;
    let comp: HandleInviteComponent;
    let el, mockStateService, mockGroupService, mockBlandPageService, mockPinService, mockRouter;
    let mockActivatedRoute, guid, accepted, groupId;

    beforeEach(() => {
        mockStateService = { setLoading: jest.fn() };
        mockGroupService = { handleInvite: jest.fn() };
        mockBlandPageService = { primeAndGo: jest.fn(), goToHandledInvite: jest.fn() };
        mockActivatedRoute = { '': jest.fn() };
        mockPinService = { getPinDetails: jest.fn() };
        mockRouter = { navigate: jest.fn() };
        guid = 'Abc123';
        groupId = 123123;
        accepted = true;
        TestBed.configureTestingModule({
            declarations: [
                HandleInviteComponent
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { params: { guid: guid, groupId: groupId }, data: [{ accepted: accepted }] } },
                },
                { provide: StateService, useValue: mockStateService },
                { provide: GroupService, useValue: mockGroupService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: PinService, useValue: mockPinService },
                { provide: Router, useValue: mockRouter }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(HandleInviteComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should ngOnInit', () => {
        comp['route'].snapshot.params = { guid: guid, groupId: groupId };
        comp['route'].snapshot.data = [{ accept: true }];
        spyOn(comp, 'handleInvite');

        comp.ngOnInit();

        expect(mockStateService.setLoading).toHaveBeenCalled();
        expect(comp.handleInvite).toHaveBeenCalled();
        expect(comp['guid']).toBe(guid);
        expect(comp['groupId']).toBe(groupId);
        expect(comp['accepted']).toBe(true);
    });

    it('should error if guid is not truthy', () => {
        spyOn(comp, 'handleInvite');
        guid = null;
        accepted = false;
        comp['route'].snapshot.data = [{ accept: accepted }];
        comp['route'].snapshot.params = { guid: guid, groupId: groupId };
        comp.ngOnInit();
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalled();
        expect(comp.handleInvite).not.toHaveBeenCalled();
        expect(comp['accepted']).toBe(accepted);
    });

    it('should handleInvite (accept) and succeed', () => {
        let name, address, pin;
        guid = 'a1real2guid3';
        accepted = true;
        pin = MockTestData.getAPin(1, 1);
        address = pin.address;
        name = pin.firstName + ' ' + pin.lastName.slice(0, 1);

        comp['guid'] = guid;
        comp['accepted'] = accepted;
        comp['groupId'] = groupId;

        mockGroupService.handleInvite.mockReturnValue(Observable.of(true));
        mockPinService.getPinDetails.mockReturnValue(Observable.of(pin));



        comp.handleInvite();

        expect(mockPinService.getPinDetails).toHaveBeenCalledWith(new PinIdentifier(pinType.GATHERING, groupId));
        expect(mockGroupService.handleInvite).toHaveBeenCalledWith(guid, accepted, groupId);
        expect(mockBlandPageService.goToHandledInvite).toHaveBeenCalledWith(accepted, groupId, address, name);
    });

    it('should handleInvite (deny) and succeed', () => {
        let name, address, pin;
        guid = 'a1real2guid3';
        accepted = false;
        pin = MockTestData.getAPin(1, 1);
        address = pin.address;
        name = pin.firstName + ' ' + pin.lastName.slice(0, 1);

        comp['guid'] = guid;
        comp['accepted'] = accepted;
        comp['groupId'] = groupId;

        mockGroupService.handleInvite.mockReturnValueOnce(Observable.of(true));
        mockPinService.getPinDetails.mockReturnValueOnce(Observable.of(pin));

        comp.handleInvite();

        expect(mockPinService.getPinDetails).toHaveBeenCalledWith(new PinIdentifier(pinType.GATHERING, groupId));
        expect(mockGroupService.handleInvite).toHaveBeenCalledWith(guid, accepted, groupId);
        expect(mockBlandPageService.goToHandledInvite).toHaveBeenCalledWith(accepted, groupId, address, name);
    });

    it('should respond to invite and fail', () => {
        guid = 'a1real2guid3';
        accepted = false;
        comp['guid'] = guid;
        comp['accepted'] = accepted;
        comp['groupId'] = groupId;

        mockGroupService.handleInvite.mockReturnValueOnce(Observable.throw('is broken'));

        comp.handleInvite();

        expect(mockBlandPageService.goToHandledInvite).not.toHaveBeenCalled();
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalled();
        expect(mockGroupService.handleInvite).toHaveBeenCalledWith(guid, accepted, groupId);
    });
});
