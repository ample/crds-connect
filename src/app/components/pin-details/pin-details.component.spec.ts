/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PlatformLocation } from '@angular/common';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { PinService } from '../../services/pin.service';

import { PinDetailsComponent } from './pin-details.component';
import { MockComponent } from '../../shared/mock.component';
import { MockTestData } from '../../shared/MockTestData';
import { pinType } from '../../models/pin';

describe('PinDetailsComponent', () => {
  let fixture: ComponentFixture<PinDetailsComponent>;
  let comp: PinDetailsComponent;
  let el;
  let pin;
  let mockPlatformLocation, mockSession, mockState, mockPinService, mockActivatedRoute;

  let route: ActivatedRoute;

  beforeEach(() => {
    pin = MockTestData.getAPin();
    mockPlatformLocation = jasmine.createSpyObj<PlatformLocation>('location', ['reload']);
    mockSession = jasmine.createSpyObj<SessionService>('session', ['isLoggedIn',  'post']);
    mockState = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['doesLoggedInUserOwnPin']);

    mockActivatedRoute = {
      snapshot: {
        data: { pin: pin, user: {} },
        params: { approved: 'true', trialMemberId: '123'}
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        PinDetailsComponent,
        MockComponent({ selector: 'address-form', inputs: ['userData', 'buttonText', 'save'] }),
        MockComponent({ selector: 'gathering', inputs: ['user', 'pin', 'isLoggedIn', 'isPinOwner'] }),
        MockComponent({ selector: 'person', inputs: ['user', 'pin', 'isLoggedIn', 'isPinOwner'] })
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute},
        { provide: PlatformLocation, useValue: mockPlatformLocation },
        { provide: SessionService, useValue: mockSession },
        { provide: StateService, useValue: mockState },
        { provide: PinService, useValue: mockPinService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(PinDetailsComponent);
      comp = fixture.componentInstance;
    });
  }));

  describe('Person Pin', () => {

    it('should create an instance', () => {
      // fixture.detectChanges();
      expect(comp).toBeTruthy();
    });

    it('doesLoggedInUserOwnPin() should return true if contactId matches', () => {
      mockPinService.doesLoggedInUserOwnPin.and.returnValue(true);
      <jasmine.Spy>(mockSession.post).and.returnValue(Observable.of(true));
      comp.ngOnInit();
      let returnValue = comp['doesLoggedInUserOwnPin']();
      expect(returnValue).toBe(true);

    });

    it('doesLoggedInUserOwnPin() should return false if contactId doesn\'t match', () => {
      mockPinService.doesLoggedInUserOwnPin.and.returnValue(false);
      <jasmine.Spy>(mockSession.post).and.returnValue(Observable.of(true));
      comp.ngOnInit();
      let returnValue = comp['doesLoggedInUserOwnPin']();
      expect(returnValue).toBe(false);
    });

   it('should init while not logged in', () => {
      mockSession.isLoggedIn.and.returnValue(false);
      <jasmine.Spy>(mockSession.post).and.returnValue(Observable.of(true));
      comp.ngOnInit();
      expect(comp.isLoggedIn).toBe(false);
      expect(comp.pin.firstName).toBe('firstName1');
      expect(mockSession.isLoggedIn.calls.count()).toEqual(1);
      expect(comp.isPinOwner).toBe(false);
    });

    it('shouldInit while logged in', () => {
      mockSession.isLoggedIn.and.returnValue(true);
      <jasmine.Spy>(mockSession.post).and.returnValue(Observable.of(true));
      expect(comp.isGatheringPin).toBe(false);
      comp.ngOnInit();
      expect(comp.isLoggedIn).toBe(true);
    });

  });

  describe('Gathering Pin', () => {
    beforeEach(() => {
      pin.pinType = pinType.GATHERING;
    });

    it('should create an instance', () => {
      expect(comp).toBeTruthy();
    });

    it('shouldInit while not logged in', () => {
      mockSession.isLoggedIn.and.returnValue(false);
      <jasmine.Spy>(mockSession.post).and.returnValue(Observable.of(true));
      comp.ngOnInit();
      expect(comp.isLoggedIn).toBe(false);
      expect(comp.isGatheringPin).toBe(true);
      expect(comp.pin.firstName).toBe('firstName1');
      expect(mockSession.isLoggedIn.calls.count()).toEqual(1);
      expect(comp.isPinOwner).toBe(false);
    });

  });

   describe('Trial member approval', () => {
    let mockBackend;

    let mockParams: object;
    const returnMockParams = function (key: string): string {
      return mockParams[key];
    };

    it('test approveOrDisapproveTrialMember success approve = true', () => {
      <jasmine.Spy>(mockSession.post).and.returnValue(Observable.of(true));

      comp.ngOnInit();
      expect(comp['trialMemberApprovalMessage']).toBe('Trial member was approved');
    });

    it('test approveOrDisapproveTrialMember success approve = false', () => {
      <jasmine.Spy>(mockSession.post).and.returnValue(Observable.of(true));

      comp['route'].snapshot.params['approved'] = 'false';
      comp.ngOnInit();
      expect(comp['trialMemberApprovalMessage']).toBe('Trial member was disapproved');
    });

    it('test approveOrDisapproveTrialMember failure', () => {
      <jasmine.Spy>(mockSession.post).and.returnValue(Observable.throw({status: 404}));

      comp.ngOnInit();
      expect(comp['trialMemberApprovalMessage']).toBe('Error approving trial member');
      expect(comp['trialMemberApprovalError']).toEqual(true);
    });

    it('test approveOrDisapproveTrialMember post not called', () => {
      <jasmine.Spy>(mockSession.post).and.returnValue(Observable.of(true));

      comp['route'].snapshot.params['approved'] = undefined;
      comp['route'].snapshot.params['trialMemberId'] = undefined;
      comp.ngOnInit();
      expect(comp['trialMemberApprovalMessage']).toEqual(undefined);
      expect(comp['session'].post).not.toHaveBeenCalled();
    });

  });
});
