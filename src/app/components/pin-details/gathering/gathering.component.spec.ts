import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTestData } from '../../../shared/MockTestData';
import { Observable } from 'rxjs/Rx';
import { Pin, pinType } from '../../../models/pin';
import { GatheringComponent } from './gathering.component';

import { Address, Group, Participant, BlandPageCause, BlandPageDetails, BlandPageType } from '../../../models';

import { AnalyticsService } from '../../../services/analytics.service';
import { AppSettingsService } from '../../../services/app-settings.service';
import { CreateGroupService } from '../../create-group/create-group-data.service';
import { SessionService } from '../../../services/session.service';
import { PinService } from '../../../services/pin.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { MiscellaneousService } from '../../../services/miscellaneous-service';
import { BlandPageService } from '../../../services/bland-page.service';
import { StateService } from '../../../services/state.service';
import { ParticipantService } from '../../../services/participant.service';
import { ToastsManager, Toast } from 'ng2-toastr';
import { AddressService } from '../../../services/address.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { MockComponent } from '../../../shared/mock.component';
import { ListHelperService } from '../../../services/list-helper.service';
import { TimeHelperService} from '../../../services/time-helper.service';
import { GroupRole } from '../../../shared/constants';


class ActivatedRouteStub {
  public params = Observable.of({ groupId: 1234, groupParticipantId: 1 });

  set testParams(params: any) {
    this.params = Observable.of(params);
  }
}

let fixture: ComponentFixture<GatheringComponent>;
let comp: GatheringComponent;
let el;
let mockAppSettingsService;
let mockSessionService;
let mockPinService;
let mockLoginRedirectService;
let mockMiscellaneousService;
let mockBlandPageService;
let mockCreateGroupService;
let mockStateService;
let mockParticipantService;
let mockToast;
let mockContentService;
let mockAddressService;
let mockListHelperService;
let mockTimeService;
let mockAnalytics;
let mockRouter;
let mockActivatedRoute;

describe('Gathering component redirect error', () => {
  beforeEach(() => {
    mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('app', ['setAppSettings', 'isConnectApp', 'isSmallGroupApp']);
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId', 'isLoggedIn', 'isAdmin']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['requestToJoinGathering']);
    mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService',
    ['redirectToLogin', 'redirectToTarget']);
    mockMiscellaneousService = jasmine.createSpyObj<MiscellaneousService>('miscellaneousService', ['reEnableScrollingInCaseFauxdalDisabledIt']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo', 'goToDefaultError']);
    mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader']);
    mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantService',
    ['clearGroupFromCache', 'getParticipants', 'getCurrentUserGroupRole', 'getAllLeaders', 'isUserAParticipant']);
    mockAddressService = jasmine.createSpyObj<AddressService>('addressService', ['getFullAddress']);
    mockToast = jasmine.createSpyObj<ToastsManager>('toast', ['warning', 'error']);
    mockContentService = jasmine.createSpyObj<ContentService>('contentService', ['getContent']);
    mockTimeService = jasmine.createSpyObj<TimeHelperService>('hackTime', ['getContent']);
    mockListHelperService = jasmine.createSpyObj<AddressService>('listHelper', ['truncateTextEllipsis']);
    mockAnalytics = jasmine.createSpyObj<AnalyticsService>('analtyics', ['joinGathering', 'joinGroup']);
    mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('createGroup', ['clearPresetDataFlagsOnGroupEdit']);
    mockActivatedRoute = new ActivatedRouteStub();
    mockRouter = {
      url: '/connect/gathering/1234', routerState:
      { snapshot: { url: 'connect/gathering/1234' } }, navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      declarations: [
        GatheringComponent,
        MockComponent({ selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass'] })
      ],
      imports: [],
      providers: [
        { provide: AppSettingsService, useValue: mockAppSettingsService },
        { provide: PinService, useValue: mockPinService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        { provide: MiscellaneousService, useValue: mockMiscellaneousService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CreateGroupService, useValue: mockCreateGroupService },
        { provide: StateService, useValue: mockStateService },
        { provide: ParticipantService, useValue: mockParticipantService },
        { provide: ToastsManager, useValue: mockToast },
        { provide: AddressService, useValue: mockAddressService },
        { provide: ContentService, useValue: mockContentService },
        { provide: ListHelperService, useValue: mockListHelperService },
        { provide: TimeHelperService, useValue: mockTimeService },
        { provide: AnalyticsService, useValue: mockAnalytics },
        {
          provide: Router,
          useValue: mockRouter
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(GatheringComponent);
      comp = fixture.componentInstance;
      comp.pin = MockTestData.getAPin(1);
    });
  }));

  beforeEach(() => {
    mockRouter = {
      url: '/connect/gathering/1234', routerState:
      { snapshot: { url: 'connect/gathering/1234' } }, navigate: jasmine.createSpy('navigate')
    };
    comp.pin = MockTestData.getAPin(1);
  });

  it('should not redirect if already on the gathering page while failing requesting to join', () => {
    mockRouter = {
      url: '/connect/gathering/1234', routerState:
      { snapshot: { url: 'connect/gathering/1234' } }, navigate: jasmine.createSpy('navigate')
    };
    mockRouter.routerState.snapshot.url = 'connect/gathering/1234';
    fixture = TestBed.createComponent(GatheringComponent);
    comp = fixture.componentInstance;
    comp.isLoggedIn = true;
    mockSessionService.isLoggedIn.and.returnValue(true);
    let pin = MockTestData.getAPin(1);
    (mockPinService.requestToJoinGathering).and.returnValue(Observable.throw({ status: 406 }));
    comp.pin = pin;

    comp.requestToJoin();
    expect(mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
    expect(mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
    expect(mockToast.warning).not.toHaveBeenCalled();
    expect(mockLoginRedirectService.redirectToTarget).not.toHaveBeenCalled();
  });
});

describe('GatheringComponent', () => {
  beforeEach(() => {
    mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('app', ['setAppSettings', 'isConnectApp', 'isSmallGroupApp']);
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId', 'isLoggedIn', 'post', 'isAdmin']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['requestToJoinGathering']);
    mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService',
    ['redirectToLogin', 'redirectToTarget']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo', 'goToDefaultError']);
    mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('createGroup', ['clearPresetDataFlagsOnGroupEdit']);
    mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader']);
    mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantService',
    ['clearGroupFromCache', 'getParticipants', 'getCurrentUserGroupRole', 'getAllLeaders', 'isUserAParticipant']);
    mockAddressService = jasmine.createSpyObj<AddressService>('addressService', ['getFullAddress']);
    mockToast = jasmine.createSpyObj<ToastsManager>('toast', ['warning', 'error']);
    mockContentService = jasmine.createSpyObj<ContentService>('contentService', ['getContent']);
    mockListHelperService = jasmine.createSpyObj<AddressService>('listHelper', ['truncateTextEllipsis']);
    mockTimeService = jasmine.createSpyObj<TimeHelperService>('hackTime', ['getContent']);
    mockAnalytics = jasmine.createSpyObj<AnalyticsService>('analytics', ['joinGroup', 'joinGathering']);
    mockRouter = { url: 'abc123', routerState: { snapshot: { url: 'abc123' } }, navigate: jasmine.createSpy('navigate') };
    let pin = MockTestData.getAPin();
    mockActivatedRoute = {
      snapshot: {
        data: { pin: pin, user: {} },
        params: { approved: 'true', trialMemberId: '123'}
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        GatheringComponent,
        MockComponent({ selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass'] })
      ],
      imports: [],
      providers: [
        { provide: AppSettingsService, useValue: mockAppSettingsService },
        { provide: PinService, useValue: mockPinService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: LoginRedirectService, useValue: mockLoginRedirectService },
        { provide: MiscellaneousService, useValue: mockMiscellaneousService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: CreateGroupService, useValue: mockCreateGroupService },
        { provide: StateService, useValue: mockStateService },
        { provide: ParticipantService, useValue: mockParticipantService },
        { provide: ToastsManager, useValue: mockToast },
        { provide: AddressService, useValue: mockAddressService },
        { provide: ListHelperService, useValue: mockListHelperService },
        { provide: ContentService, useValue: mockContentService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TimeHelperService, useValue: mockTimeService },
        { provide: AnalyticsService, useValue: mockAnalytics },
        {
          provide: Router,
          useValue: mockRouter
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(GatheringComponent);
      comp = fixture.componentInstance;
      comp.pin = MockTestData.getAPin(1);
    });
  }));

  it('should create an instance', () => {
    expect(comp).toBeTruthy();
  });

  it('should init, get participants and loggedInUser is in gathering', () => {
    let addLine1 = '567 street ln.';
    let participants = MockTestData.getAParticipantsArray(3);
    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));
    (<jasmine.Spy>mockParticipantService.getParticipants).and.returnValue(Observable.of(participants));
    (<jasmine.Spy>mockParticipantService.getCurrentUserGroupRole).and.returnValue(Observable.of(GroupRole.LEADER));
    (<jasmine.Spy>mockParticipantService.getAllLeaders).and.returnValue(Observable.of(participants));
    (mockAddressService.getFullAddress).and.returnValue(Observable.of(
      new Address(null, addLine1, null, null, null, null, null, null, null, null)));
      comp['route'].snapshot.params['approved'] = undefined;
      comp['route'].snapshot.params['trialMemberId'] = undefined;
      comp.isLoggedIn = true;
      comp.ngOnInit();
      expect(comp.isInGathering).toBe(true);
      expect(mockParticipantService.getParticipants).toHaveBeenCalledWith(comp.pin.gathering.groupId, false);
      expect(comp['pin'].gathering.address.addressLine1).toBe(addLine1);
    });

    it('should init, get participants and loggedInUser is NOT in gathering', () => {
      let pin = MockTestData.getAPin(1);
      let addLine1 = '567 street ln.';
      let participants = MockTestData.getAParticipantsArray(3);
      <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));
      (<jasmine.Spy>mockParticipantService.getParticipants).and.returnValue(Observable.of(participants));
      (<jasmine.Spy>mockParticipantService.getCurrentUserGroupRole).and.returnValue(Observable.of(GroupRole.NONE));
      (<jasmine.Spy>mockParticipantService.getAllLeaders).and.returnValue(Observable.of(participants));
      comp.isLoggedIn = true;
      comp.ngOnInit();
      expect(comp.isInGathering).toBe(false);
      expect(mockParticipantService.getParticipants).toHaveBeenCalledWith(comp.pin.gathering.groupId, false);
    });

    it('should init and fail to get participants then go to error page', () => {
      comp.pin = MockTestData.getAPin(1);
      <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));
      (<jasmine.Spy>mockParticipantService.getParticipants).and.returnValue(Observable.throw({ status: 500 }));
      (<jasmine.Spy>mockParticipantService.getCurrentUserGroupRole).and.returnValue(Observable.of(GroupRole.LEADER));
      (<jasmine.Spy>mockParticipantService.getAllLeaders).and.returnValue(Observable.of([]));
      (<jasmine.Spy>mockSessionService.getContactId).and.returnValue(8675309);
      comp.isLoggedIn = true;
      comp.ngOnInit();
      expect(mockParticipantService.getParticipants).toHaveBeenCalledWith(comp.pin.gathering.groupId, false);
      expect(mockSessionService.getContactId).not.toHaveBeenCalled();
      expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('');
      expect(mockAddressService.getFullAddress).not.toHaveBeenCalled();
    });

    it('should init and fail to get full address then toast', () => {
      let participants = MockTestData.getAParticipantsArray(3);
      let expectedText = '<p>Looks like there was an error. Please fix and try again</p>';
      mockContentService.getContent.and.returnValue(expectedText);
      <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));
      mockParticipantService.getParticipants.and.returnValue(Observable.of(participants));
      (<jasmine.Spy>mockParticipantService.getCurrentUserGroupRole).and.returnValue(Observable.of(GroupRole.LEADER));
      (<jasmine.Spy>mockParticipantService.getAllLeaders).and.returnValue(Observable.of(participants));
      mockAddressService.getFullAddress.and.returnValue(Observable.throw({ status: 500 }));
      comp.isLoggedIn = true;
      comp.ngOnInit();
      expect(mockParticipantService.getParticipants).toHaveBeenCalledWith(comp.pin.gathering.groupId, false);
      expect(<jasmine.Spy>mockBlandPageService.goToDefaultError).not.toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalledWith(expectedText);
    });

    it('should redirectToLogin while request(ing)ToJoin', () => {
      comp.isLoggedIn = false;
      mockSessionService.isLoggedIn.and.returnValue(false);
      comp.requestToJoin();
      expect(<jasmine.Spy>mockLoginRedirectService.redirectToLogin).toHaveBeenCalledWith('abc123', jasmine.any(Function));
    });

    it('should succeed while requesting to join gathering', () => {
      comp.isLoggedIn = true;
      mockSessionService.isLoggedIn.and.returnValue(true);
      (<jasmine.Spy>mockAppSettingsService.isConnectApp).and.returnValue(true);
      let pin = MockTestData.getAPin(1);
      let expectedBPD = new BlandPageDetails(
        'Return to map',
        'finderGatheringJoinRequestSent',
        BlandPageType.ContentBlock,
        BlandPageCause.Success,
        ''
      );
      (<jasmine.Spy>mockPinService.requestToJoinGathering).and.returnValue(Observable.of([{}]));
      comp.pin = pin;
      comp.requestToJoin();
      expect(mockAnalytics.joinGathering).toHaveBeenCalled();
      expect(<jasmine.Spy>mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
      expect(<jasmine.Spy>mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
      expect(<jasmine.Spy>mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBPD);
    });

    it('should succeed while requesting to join group', () => {
      comp.isLoggedIn = true;
      mockSessionService.isLoggedIn.and.returnValue(true);
      (<jasmine.Spy>mockAppSettingsService.isConnectApp).and.returnValue(false);
      let pin = MockTestData.getAPin(1);
      let expectedBPD = new BlandPageDetails(
        'Return to map',
        'finderGroupJoinRequestSent',
        BlandPageType.ContentBlock,
        BlandPageCause.Success,
        ''
      );
      (<jasmine.Spy>mockPinService.requestToJoinGathering).and.returnValue(Observable.of([{}]));
      comp.pin = pin;


      comp.requestToJoin();
      expect(mockAnalytics.joinGroup).toHaveBeenCalled();
      expect(<jasmine.Spy>mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
      expect(<jasmine.Spy>mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
      expect(<jasmine.Spy>mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBPD);
    });

    it('should fail with 409 (conflict) while requesting to join', () => {
      let expectedText = '<p>Looks like you have already requested to join this group.</p>';
      (<jasmine.Spy>mockContentService.getContent).and.returnValue(expectedText);
      comp.isLoggedIn = true;
      mockSessionService.isLoggedIn.and.returnValue(true);
      let pin = MockTestData.getAPin(1);

      (mockPinService.requestToJoinGathering).and.returnValue(Observable.throw({ status: 409 }));
      comp.pin = pin;

      comp.requestToJoin();
      expect(mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
      expect(mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
      expect(mockToast.warning).toHaveBeenCalledWith(expectedText);
      expect(mockLoginRedirectService.redirectToTarget).toHaveBeenCalled();
    });

    it('should do nothing with 406 (unacceptable) while requesting to join', () => {
      comp.isLoggedIn = true;
      mockSessionService.isLoggedIn.and.returnValue(true);
      let pin = MockTestData.getAPin(1);
      (mockPinService.requestToJoinGathering).and.returnValue(Observable.throw({ status: 406 }));
      comp.pin = pin;

      comp.requestToJoin();
      expect(mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
      expect(mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
      expect(mockToast.warning).not.toHaveBeenCalled();
      expect(mockLoginRedirectService.redirectToTarget).toHaveBeenCalled();
    });

    it('should fail with error while requesting to join', () => {
      let expectedText = '<p>Looks like there was an error. Please fix and try again</p>';
      (<jasmine.Spy>mockContentService.getContent).and.returnValue(expectedText);
      comp.isLoggedIn = true;
      mockSessionService.isLoggedIn.and.returnValue(true);
      let pin = MockTestData.getAPin(1);
      comp.pin = pin;
      (<jasmine.Spy>mockPinService.requestToJoinGathering).and.returnValue(Observable.throw({ status: 500 }));

      comp.requestToJoin();
      expect(<jasmine.Spy>mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
      expect(<jasmine.Spy>mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
      expect(<jasmine.Spy>mockBlandPageService.primeAndGo).not.toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalledWith(expectedText);
      expect(mockLoginRedirectService.redirectToTarget).toHaveBeenCalled();
    });

    it('should toast when failing getting address', () => {
      let expectedText = '<p>Looks like there was an error. Please fix and try again</p>';
      (<jasmine.Spy>mockContentService.getContent).and.returnValue(expectedText);
      comp.isLoggedIn = true;
    });

    it('should edit', () => {
      let pin = MockTestData.getAPin(1);
      comp['pin'] = pin;
      comp.edit();
      expect(comp['router'].navigate).toHaveBeenCalledWith(['/gathering', pin.gathering.groupId, 'edit']);
    });

    it('should show online group string', () => {
      let pin = MockTestData.getAPin(1);
      pin.gathering = new Group();
      pin.gathering.isVirtualGroup = true;
      comp['pin'] = pin;
      let rc = comp.getProximityString();
      expect(rc).toBe('(ONLINE GROUP)');
    });

    it('showsocial should return true', () => {
      let rc = comp.showSocial();
      expect(rc).toBe(true);
    });

    it('getProximityString should return an empty string when proximity is null', () => {
      const pin = MockTestData.getAPin(1);
      pin.proximity = null;
      comp['pin'] = pin;
      let proximityString = comp.getProximityString();
      expect(proximityString).toEqual('');
    });

    describe('Trial member approval', () => {
      let mockBackend;
      let mockParams: object;
      const returnMockParams = function (key: string): string {
        return mockParams[key];
      };

      it('test approveOrDisapproveTrialMember success approve = true', () => {
        <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));
        let participants = MockTestData.getAParticipantsArray(3);
        (<jasmine.Spy>mockParticipantService.getParticipants).and.returnValue(Observable.of(participants));
        (<jasmine.Spy>mockParticipantService.getCurrentUserGroupRole).and.returnValue(Observable.of(GroupRole.LEADER));
        (<jasmine.Spy>mockParticipantService.getAllLeaders).and.returnValue(Observable.of(participants));
        (mockAddressService.getFullAddress).and.returnValue(Observable.of(
          new Address(null, 'who cares', null, null, null, null, null, null, null, null)));
        comp.ngOnInit();
        expect(comp['trialMemberApprovalMessage']).toBe('Trial member was approved');
      });

      it('test approveOrDisapproveTrialMember success approve = false', () => {
        <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));
        let participants = MockTestData.getAParticipantsArray(3);
        (<jasmine.Spy>mockParticipantService.getParticipants).and.returnValue(Observable.of(participants));
        (<jasmine.Spy>mockParticipantService.getCurrentUserGroupRole).and.returnValue(Observable.of(GroupRole.LEADER));
        (<jasmine.Spy>mockParticipantService.getAllLeaders).and.returnValue(Observable.of(participants));
        (mockAddressService.getFullAddress).and.returnValue(Observable.of(
          new Address(null, 'who cares', null, null, null, null, null, null, null, null)));
        comp['route'].snapshot.params['approved'] = 'false';
        comp.approveOrDisapproveTrialMember();
        expect(comp['trialMemberApprovalMessage']).toBe('Trial member was disapproved');
      });

      it('test approveOrDisapproveTrialMember failure', () => {
        <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.throw({status: 404}));
        let participants = MockTestData.getAParticipantsArray(3);
        (<jasmine.Spy>mockParticipantService.getParticipants).and.returnValue(Observable.of(participants));
        (<jasmine.Spy>mockParticipantService.getCurrentUserGroupRole).and.returnValue(Observable.of(GroupRole.LEADER));
        (<jasmine.Spy>mockParticipantService.getAllLeaders).and.returnValue(Observable.of(participants));
        comp.ngOnInit();
        expect(comp['trialMemberApprovalMessage']).toBe('Error approving trial member');
        expect(comp['trialMemberApprovalError']).toEqual(true);
      });

      it('test approveOrDisapproveTrialMember post not called', () => {
        <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));
        let participants = MockTestData.getAParticipantsArray(3);
        (<jasmine.Spy>mockParticipantService.getParticipants).and.returnValue(Observable.of(participants));
        (<jasmine.Spy>mockParticipantService.getCurrentUserGroupRole).and.returnValue(Observable.of(GroupRole.LEADER));
        (<jasmine.Spy>mockParticipantService.getAllLeaders).and.returnValue(Observable.of(participants));
        (mockAddressService.getFullAddress).and.returnValue(Observable.of(
          new Address(null, 'who cares', null, null, null, null, null, null, null, null)));

        comp['route'].snapshot.params['approved'] = undefined;
        comp['route'].snapshot.params['trialMemberId'] = undefined;
        comp.ngOnInit();
        expect(comp['trialMemberApprovalMessage']).toEqual(undefined);
        expect(comp['session'].post).not.toHaveBeenCalled();
      });
    });
  });
