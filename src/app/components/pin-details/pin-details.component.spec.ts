/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

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
  let mockPlatformLocation, mockSession, mockState, mockPinService;

  beforeEach(() => {
    pin = MockTestData.getAPin();
    mockPlatformLocation = jasmine.createSpyObj<PlatformLocation>('location', ['reload']);
    mockSession = jasmine.createSpyObj<SessionService>('session', ['isLoggedIn']);
    mockState = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['doesLoggedInUserOwnPin']);
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
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { pin: pin, user: {} } } },
        },
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
      fixture.detectChanges();
      expect(comp).toBeTruthy();
    });

    it('doesLoggedInUserOwnPin() should return true if contactId matches', () => {
      mockPinService.doesLoggedInUserOwnPin.and.returnValue(true);
      comp.ngOnInit();
      let returnValue = comp['doesLoggedInUserOwnPin']();
      expect(returnValue).toBe(true);

    });

    it('doesLoggedInUserOwnPin() should return false if contactId doesn\'t match', () => {
      mockPinService.doesLoggedInUserOwnPin.and.returnValue(false);
      comp.ngOnInit();
      let returnValue = comp['doesLoggedInUserOwnPin']();
      expect(returnValue).toBe(false);
    });

    it('should init while not logged in', () => {
      mockSession.isLoggedIn.and.returnValue(false);
      comp.ngOnInit();
      expect(comp.isLoggedIn).toBe(false);
      expect(comp.pin.firstName).toBe('firstName1');
      expect(mockSession.isLoggedIn.calls.count()).toEqual(1);
      expect(comp.isPinOwner).toBe(false);
    });

    it('shouldInit while logged in', () => {
      mockSession.isLoggedIn.and.returnValue(true);
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
      comp.ngOnInit();
      expect(comp.isLoggedIn).toBe(false);
      expect(comp.isGatheringPin).toBe(true);
      expect(comp.pin.firstName).toBe('firstName1');
      expect(mockSession.isLoggedIn.calls.count()).toEqual(1);
      expect(comp.isPinOwner).toBe(false);
    });
  });
});
