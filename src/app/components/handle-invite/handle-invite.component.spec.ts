import { error } from 'util';
import { Observable } from 'rxjs/Rx';
import { BlandPageDetails } from '../../models/bland-page-details';
import { ActivatedRoute } from '@angular/router';
import { BlandPageService } from '../../services/bland-page.service';
import { GroupService } from '../../services/group.service';
/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HandleInviteComponent } from './handle-invite.component';

import { StateService } from '../../services/state.service';

describe('HandleInviteComponent', () => {
    let fixture: ComponentFixture<HandleInviteComponent>;
    let comp: HandleInviteComponent;
    let el, mockStateService, mockGroupService, mockBlandPageService;
    let mockActivatedRoute, guid, accepted, groupId;

    beforeEach(() => {
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
        mockGroupService = jasmine.createSpyObj<GroupService>('groupService', ['handleInvite']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService',
            ['primeAndGo', 'goToHandledInvite']);
        mockActivatedRoute = jasmine.createSpyObj<ActivatedRoute>('route', ['']);
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
                { provide: BlandPageService, useValue: mockBlandPageService }
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

    fit('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    fit('should ngOnInit', () => {
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

    fit('should error if guid is not truthy', () => {
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

    fit('should handleInvite (accept) and succeed', () => {
        guid = 'a1real2guid3';
        accepted = true;
        comp['guid'] = guid;
        comp['accepted'] = accepted;
        comp['groupId'] = groupId;

        (mockGroupService.handleInvite).and.returnValue(Observable.of(true));

        comp.handleInvite();

        expect(mockBlandPageService.goToHandledInvite).toHaveBeenCalledWith(accepted, groupId);
        expect(mockGroupService.handleInvite).toHaveBeenCalledWith(guid, accepted, groupId);
    });

    fit('should handleInvite (deny) and succeed', () => {
        guid = 'a1real2guid3';
        accepted = false;
        comp['guid'] = guid;
        comp['accepted'] = accepted;
        comp['groupId'] = groupId;

        (mockGroupService.handleInvite).and.returnValue(Observable.of(true));

        comp.handleInvite();

        expect(mockBlandPageService.goToHandledInvite).toHaveBeenCalledWith(accepted, groupId);
        expect(mockBlandPageService.primeAndGo).not.toHaveBeenCalled();
        expect(mockGroupService.handleInvite).toHaveBeenCalledWith(guid, accepted, groupId);
    });

    fit('should respond to invite and fail', () => {
        guid = 'a1real2guid3';
        accepted = false;
        comp['guid'] = guid;
        comp['accepted'] = accepted;
        comp['groupId'] = groupId;

        (mockGroupService.handleInvite).and.returnValue(Observable.throw('is broken'));

        comp.handleInvite();

        expect(mockBlandPageService.goToHandledInvite).not.toHaveBeenCalled();
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalled();
        expect(mockGroupService.handleInvite).toHaveBeenCalledWith(guid, accepted, groupId);
    });
});
