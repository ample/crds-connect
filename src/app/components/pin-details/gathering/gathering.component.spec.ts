import { UtcTimeFormatPipe } from '../../../pipes/utc-time-format.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTestData } from '../../../shared/MockTestData';
import { Observable } from 'rxjs/Rx';
import { GatheringComponent } from './gathering.component';

import { Address, Group, Participant, BlandPageCause, BlandPageDetails, BlandPageType, Pin, pinType } from '../../../models';

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
        UtcTimeFormatPipe,
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
    const pin = MockTestData.getAPin(1);
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
    mockMiscellaneousService = jasmine.createSpyObj<MiscellaneousService>('miscellaneousService', ['reEnableScrollingInCaseFauxdalDisabledIt']);
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
    mockAnalytics = jasmine.createSpyObj<AnalyticsService>('analytics', ['joinGroup', 'joinGathering']);
    mockRouter = { url: 'abc123', routerState: { snapshot: { url: 'abc123' } }, navigate: jasmine.createSpy('navigate') };
    const pin = MockTestData.getAPin();
    mockActivatedRoute = {
      snapshot: {
        data: { pin: pin, user: {} },
        params: { approved: 'true', trialMemberId: '123' }
      }
    };

    TestBed.configureTestingModule({
      declarations: [
        GatheringComponent,
        UtcTimeFormatPipe,
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
    const addLine1 = '567 street ln.';
    const participants = MockTestData.getAParticipantsArray(3);
    mockSessionService.post.and.returnValue(Observable.of(true));
    mockParticipantService.getParticipants.and.returnValue(Observable.of(participants));
    mockParticipantService.getCurrentUserGroupRole.and.returnValue(Observable.of(GroupRole.LEADER));
    mockParticipantService.getAllLeaders.and.returnValue(Observable.of(participants));
    mockAddressService.getFullAddress.and.returnValue(Observable.of(
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
    const pin = MockTestData.getAPin(1);
    const addLine1 = '567 street ln.';
    const participants = MockTestData.getAParticipantsArray(3);
    mockSessionService.post.and.returnValue(Observable.of(true));
    mockParticipantService.getParticipants.and.returnValue(Observable.of(participants));
    mockParticipantService.getCurrentUserGroupRole.and.returnValue(Observable.of(GroupRole.NONE));
    mockParticipantService.getAllLeaders.and.returnValue(Observable.of(participants));
    comp.isLoggedIn = true;
    comp.ngOnInit();
    expect(comp.isInGathering).toBe(false);
    expect(mockParticipantService.getParticipants).toHaveBeenCalledWith(comp.pin.gathering.groupId, false);
  });

  it('should init and fail to get participants then go to error page', () => {
    comp.pin = MockTestData.getAPin(1);
    mockSessionService.post.and.returnValue(Observable.of(true));
    mockParticipantService.getParticipants.and.returnValue(Observable.throw({ status: 500 }));
    mockParticipantService.getCurrentUserGroupRole.and.returnValue(Observable.of(GroupRole.LEADER));
    mockParticipantService.getAllLeaders.and.returnValue(Observable.of([]));
    mockSessionService.getContactId.and.returnValue(8675309);
    comp.isLoggedIn = true;
    comp.ngOnInit();
    expect(mockParticipantService.getParticipants).toHaveBeenCalledWith(comp.pin.gathering.groupId, false);
    expect(mockSessionService.getContactId).not.toHaveBeenCalled();
    expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('');
    expect(mockAddressService.getFullAddress).not.toHaveBeenCalled();
  });

  it('should init and fail to get full address then toast', () => {
    const participants = MockTestData.getAParticipantsArray(3);
    const expectedText = '<p>Looks like there was an error. Please fix and try again</p>';
    mockContentService.getContent.and.returnValue(Observable.of({ content: expectedText }));
    mockSessionService.post.and.returnValue(Observable.of(true));
    mockParticipantService.getParticipants.and.returnValue(Observable.of(participants));
    mockParticipantService.getCurrentUserGroupRole.and.returnValue(Observable.of(GroupRole.LEADER));
    mockParticipantService.getAllLeaders.and.returnValue(Observable.of(participants));
    mockAddressService.getFullAddress.and.returnValue(Observable.throw({ status: 500 }));
    comp.isLoggedIn = true;
    comp.ngOnInit();
    expect(mockParticipantService.getParticipants).toHaveBeenCalledWith(comp.pin.gathering.groupId, false);
    expect(mockBlandPageService.goToDefaultError).not.toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith(expectedText);
  });

  it('should redirectToLogin while request(ing)ToJoin', () => {
    comp.isLoggedIn = false;
    mockSessionService.isLoggedIn.and.returnValue(false);
    comp.requestToJoin();
    expect(mockLoginRedirectService.redirectToLogin).toHaveBeenCalledWith('abc123', jasmine.any(Function));
  });

  it('should succeed while requesting to join gathering', () => {
    comp.isLoggedIn = true;
    mockSessionService.isLoggedIn.and.returnValue(true);
    mockAppSettingsService.isConnectApp.and.returnValue(true);
    const pin = MockTestData.getAPin(1);
    const expectedBPD = new BlandPageDetails(
      'Return to map',
      'finderGatheringJoinRequestSent',
      BlandPageType.ContentBlock,
      BlandPageCause.Success,
      ''
    );
    mockPinService.requestToJoinGathering.and.returnValue(Observable.of([{}]));
    comp.pin = pin;
    comp.requestToJoin();
    expect(mockAnalytics.joinGathering).toHaveBeenCalled();
    expect(mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
    expect(mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
    expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBPD);
  });

  it('should succeed while requesting to join group', () => {
    comp.isLoggedIn = true;
    mockSessionService.isLoggedIn.and.returnValue(true);
    mockAppSettingsService.isConnectApp.and.returnValue(false);
    const pin = MockTestData.getAPin(1);
    const expectedBPD = new BlandPageDetails(
      'Return to map',
      'finderGroupJoinRequestSent',
      BlandPageType.ContentBlock,
      BlandPageCause.Success,
      ''
    );
    mockPinService.requestToJoinGathering.and.returnValue(Observable.of([{}]));
    comp.pin = pin;


    comp.requestToJoin();
    expect(mockAnalytics.joinGroup).toHaveBeenCalled();
    expect(mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
    expect(mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
    expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBPD);
  });

  it('should fail with 409 (conflict) while requesting to join', () => {
    const expectedText = '<p>Looks like you have already requested to join this group.</p>';
    mockContentService.getContent.and.returnValue(Observable.of({ content: expectedText }));
    comp.isLoggedIn = true;
    mockSessionService.isLoggedIn.and.returnValue(true);
    const pin = MockTestData.getAPin(1);

    mockPinService.requestToJoinGathering.and.returnValue(Observable.throw({ status: 409 }));
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
    const pin = MockTestData.getAPin(1);
    mockPinService.requestToJoinGathering.and.returnValue(Observable.throw({ status: 406 }));
    comp.pin = pin;

    comp.requestToJoin();
    expect(mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
    expect(mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
    expect(mockToast.warning).not.toHaveBeenCalled();
    expect(mockLoginRedirectService.redirectToTarget).toHaveBeenCalled();
  });

  it('should fail with error while requesting to join', () => {
    const expectedText = '<p>Looks like there was an error. Please fix and try again</p>';
    mockContentService.getContent.and.returnValue(Observable.of({ content: expectedText }));
    comp.isLoggedIn = true;
    mockSessionService.isLoggedIn.and.returnValue(true);
    const pin = MockTestData.getAPin(1);
    comp.pin = pin;
    mockPinService.requestToJoinGathering.and.returnValue(Observable.throw({ status: 500 }));

    comp.requestToJoin();
    expect(mockLoginRedirectService.redirectToLogin).not.toHaveBeenCalled();
    expect(mockPinService.requestToJoinGathering).toHaveBeenCalledWith(pin.gathering.groupId);
    expect(mockBlandPageService.primeAndGo).not.toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith(expectedText);
    expect(mockLoginRedirectService.redirectToTarget).toHaveBeenCalled();
  });

  it('should toast when failing getting address', () => {
    const expectedText = '<p>Looks like there was an error. Please fix and try again</p>';
    mockContentService.getContent.and.returnValue(Observable.of({ content: expectedText }));
    comp.isLoggedIn = true;
  });

  it('should edit', () => {
    const pin = MockTestData.getAPin(1);
    comp['pin'] = pin;
    comp.edit();
    expect(comp['router'].navigate).toHaveBeenCalledWith(['/gathering', pin.gathering.groupId, 'edit']);
  });

  it('should show online group string', () => {
    const pin = MockTestData.getAPin(1);
    pin.gathering = new Group();
    pin.gathering.isVirtualGroup = true;
    comp['pin'] = pin;
    const rc = comp.getProximityString();
    expect(rc).toBe('(ONLINE GROUP)');
  });

  it('showsocial should return true for connect app', () => {
    mockAppSettingsService.isConnectApp.and.returnValue(true);
    const rc = comp.showSocial();
    expect(rc).toBe(true);
  });

  it('showsocial should return true for small group app', () => {
    mockAppSettingsService.isSmallGroupApp.and.returnValue(true);
    const pin = MockTestData.getAPin(1);
    comp['pin'] = pin;
    const rc = comp.showSocial();
    expect(rc).toBe(true);
  });

  it('getProximityString should return an empty string when proximity is null', () => {
    const pin = MockTestData.getAPin(1);
    pin.proximity = null;
    comp['pin'] = pin;
    const proximityString = comp.getProximityString();
    expect(proximityString).toEqual('');
  });

  describe('Trial member approval', () => {
    let mockBackend;
    let mockParams: object;
    const returnMockParams = function (key: string): string {
      return mockParams[key];
    };

    it('test approveOrDisapproveTrialMember success approve = true', () => {
      mockSessionService.post.and.returnValue(Observable.of(true));
      const participants = MockTestData.getAParticipantsArray(3);
      mockParticipantService.getParticipants.and.returnValue(Observable.of(participants));
      mockParticipantService.getCurrentUserGroupRole.and.returnValue(Observable.of(GroupRole.LEADER));
      mockParticipantService.getAllLeaders.and.returnValue(Observable.of(participants));
      (mockAddressService.getFullAddress).and.returnValue(Observable.of(
        new Address(null, 'who cares', null, null, null, null, null, null, null, null)));
      comp.ngOnInit();
      expect(comp['trialMemberApprovalMessage']).toBe('Trial member was approved');
    });

    it('showsocial should return true for connect app', () => {
      (<jasmine.Spy>mockAppSettingsService.isConnectApp).and.returnValue(true);
      const rc = comp.showSocial();
      expect(rc).toBe(true);
    });

    it('showsocial should return true for small group app', () => {
      (<jasmine.Spy>mockAppSettingsService.isSmallGroupApp).and.returnValue(true);
      const pin = MockTestData.getAPin(1);
      comp['pin'] = pin;
      const rc = comp.showSocial();
      expect(rc).toBe(true);
    });

    it('test approveOrDisapproveTrialMember failure', () => {
      mockSessionService.post.and.returnValue(Observable.throw({ status: 404 }));
      const participants = MockTestData.getAParticipantsArray(3);
      mockParticipantService.getParticipants.and.returnValue(Observable.of(participants));
      mockParticipantService.getCurrentUserGroupRole.and.returnValue(Observable.of(GroupRole.LEADER));
      mockParticipantService.getAllLeaders.and.returnValue(Observable.of(participants));
      comp.ngOnInit();
      expect(comp['trialMemberApprovalMessage']).toBe('Error approving trial member');
      expect(comp['trialMemberApprovalError']).toEqual(true);
    });

    it('test approveOrDisapproveTrialMember post not called', () => {
      mockSessionService.post.and.returnValue(Observable.of(true));
      const participants = MockTestData.getAParticipantsArray(3);
      mockParticipantService.getParticipants.and.returnValue(Observable.of(participants));
      mockParticipantService.getCurrentUserGroupRole.and.returnValue(Observable.of(GroupRole.LEADER));
      mockParticipantService.getAllLeaders.and.returnValue(Observable.of(participants));
      mockAddressService.getFullAddress.and.returnValue(Observable.of(
        new Address(null, 'who cares', null, null, null, null, null, null, null, null)));

      comp['route'].snapshot.params['approved'] = undefined;
      comp['route'].snapshot.params['trialMemberId'] = undefined;
      comp.ngOnInit();
      expect(comp['trialMemberApprovalMessage']).toEqual(undefined);
      expect(comp['session'].post).not.toHaveBeenCalled();
    });
  });
});
