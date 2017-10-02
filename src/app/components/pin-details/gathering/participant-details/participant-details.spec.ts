import { Address } from '../../../../models';
import { Observable } from 'rxjs/Rx';
import { MockTestData } from '../../../../shared/MockTestData';
import { AddressService } from '../../../../services/address.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../../../services/participant.service';
import { MockComponent } from '../../../../shared/mock.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { GroupRole, MaxGroupLeaders, MaxGroupApprentices } from '../../../../shared/constants';
import { ParticipantDetailsComponent } from './participant-details.component';
import { ToastsManager } from 'ng2-toastr';
import { ContentService } from 'crds-ng2-content-block';
import { RouterTestingModule } from '@angular/router/testing';
import { AppSettingsService } from '../../../../services/app-settings.service';

class ActivatedRouteStub {
  params = Observable.of({ groupId: 1234, groupParticipantId: 1 });

  set testParams(params: any) {
    this.params = Observable.of(params);
  }
}

describe('ParticipantDetailsComponent', () => {
  let fixture: ComponentFixture<ParticipantDetailsComponent>;
  let comp: ParticipantDetailsComponent;
  let el;
  let mockParticipantService, mockRouter,
      mockStateService, mockBlandPageService,
      mockAddressService, mockToast,
      mockContent, mockAppSettingsService;
  let mockRoute: ActivatedRouteStub;

  beforeEach(() => {
    mockParticipantService = jasmine.createSpyObj('participantService',
                                                 ['getGroupParticipant',
                                                 'getAllParticipantsOfRoleInGroup',
                                                 'updateParticipantRole']);
    mockRouter = {
      url: '/connect/gathering/1234', routerState:
      { snapshot: { url: 'connect/gathering/1234' } }, navigate: jasmine.createSpy('navigate')
    };
    mockRoute = new ActivatedRouteStub();
    mockStateService = jasmine.createSpyObj('state', ['setLoading', 'setPageHeader']);
    mockBlandPageService = jasmine.createSpyObj('blandPageService', ['goToDefaultError']);
    mockAddressService = jasmine.createSpyObj('addressService', ['getPartialPersonAddress']);
    mockToast = jasmine.createSpyObj('toast', ['warning']);
    mockContent = jasmine.createSpyObj('content', ['getContent']);
    mockAppSettingsService = jasmine.createSpyObj('appSettings', ['isSmallGroupApp']);

    TestBed.configureTestingModule({
      declarations: [
        ParticipantDetailsComponent,
        MockComponent({ selector: 'profile-picture', inputs: ['imageClass', 'wrapperClass', 'contactid'] }),
        MockComponent({ selector: 'readonly-address', inputs: ['isGathering', 'isPinOwner', 'isInGathering', 'address'] })
      ],
      providers: [
        { provide: ParticipantService, useValue: mockParticipantService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: StateService, useValue: mockStateService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: AddressService, useValue: mockAddressService },
        { provide: ToastsManager, useValue: mockToast},
        { provide: ContentService, useValue: mockContent},
        { provide: AppSettingsService, useValue: mockAppSettingsService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ParticipantDetailsComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should init', () => {
    spyOn(comp, 'loadParticipantData');
    comp.ngOnInit();
    expect(comp['loadParticipantData']).toHaveBeenCalledTimes(1);
    expect(comp['groupId']).toBe(1234);
    expect(comp['groupParticipantId']).toBe(1);
    expect(mockStateService.setLoading).toHaveBeenCalledWith(true);
  });

  it('should loadParticipantData happiest path', () => {
    let groupId = 44;
    let groupParticipantId = 42;
    let participant = MockTestData.getAParticipantsArray()[0];
    let address = MockTestData.getAnAddress();
    comp['groupId'] = groupId;
    comp['groupParticipantId'] = groupParticipantId;
    comp['redirectUrl'] = '/test';

    (mockParticipantService.getGroupParticipant).and.returnValue(Observable.of(participant));
    (mockAddressService.getPartialPersonAddress).and.returnValue(Observable.of(address));
    (mockParticipantService.updateParticipantRole).and.returnValue(true);

    (mockParticipantService.getAllParticipantsOfRoleInGroup).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));

    comp['loadParticipantData']();
    expect(mockParticipantService.getGroupParticipant).toHaveBeenCalledWith(groupId, groupParticipantId);
    expect(mockAddressService.getPartialPersonAddress).toHaveBeenCalledWith(participant.participantId);
    expect(mockStateService.setPageHeader).toHaveBeenCalledWith('Participant', '/test');
    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(comp['participant']).toBe(participant);
    expect(comp['participantAddress']).toBe(address);
    expect(comp['componentIsReady']).toBe(true);
    expect(comp['isValidAddress']).toBe(true);
  });

  it('should loadParticipantData without address', () => {
    let groupId = 44;
    let groupParticipantId = 42;
    let participant = MockTestData.getAParticipantsArray()[1];
    comp['groupId'] = groupId;
    comp['groupParticipantId'] = groupParticipantId;
    comp['redirectUrl'] = '/small-group/1234';

    (mockParticipantService.getGroupParticipant).and.returnValue(Observable.of(participant));
    (mockAddressService.getPartialPersonAddress).and.returnValue(Observable.of(null));
    (mockParticipantService.getAllParticipantsOfRoleInGroup).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));

    comp['loadParticipantData']();

    expect(comp['participant'].participantId).toBe(1);
    expect(comp['isValidAddress']).toBeFalsy();
    expect(mockStateService.setPageHeader).toHaveBeenCalledWith('Participant', '/small-group/1234');
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
    expect(mockParticipantService.getGroupParticipant).toHaveBeenCalledTimes(1);
    expect(mockAddressService.getPartialPersonAddress).toHaveBeenCalledTimes(1);
  });

  it('should loadParticipantData on get address error', () => {
    let groupId = 44;
    let groupParticipantId = 42;
    let participant = MockTestData.getAParticipantsArray()[1];
    comp['groupId'] = groupId;
    comp['groupParticipantId'] = groupParticipantId;
    comp['redirectUrl'] = '/small-group/1234';

    (mockParticipantService.getGroupParticipant).and.returnValue(Observable.of(participant));
    (mockAddressService.getPartialPersonAddress).and.returnValue(Observable.throw({error: 'nooooo'}));
    (mockParticipantService.getAllParticipantsOfRoleInGroup).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));

    comp['loadParticipantData']();

    expect(comp['participant'].participantId).toBe(1);
    expect(comp['isValidAddress']).toBeFalsy();
    expect(mockStateService.setPageHeader).toHaveBeenCalledWith('Participant', '/small-group/1234');
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
  });

  it('should handle no participant found', () => {
    (mockParticipantService.getGroupParticipant).and.returnValue(Observable.of(null));
    (mockParticipantService.getAllParticipantsOfRoleInGroup).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()));
    comp['redirectUrl'] = '/small-group/1234';

    comp['loadParticipantData']();

    expect(comp['participant']).toBeUndefined();
    expect(comp['isValidAddress']).toBeFalsy();
    expect(mockAddressService.getPartialPersonAddress).not.toHaveBeenCalled();
    expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('/small-group/1234');
  });

  it('should handle error on getGroupParticipant call', () => {
    (mockParticipantService.getGroupParticipant).and.returnValue(Observable.throw({error: 'noooo'}));
    comp['redirectUrl'] = '/small-group/1234';
    comp['loadParticipantData']();

    expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('/small-group/1234');
  });

  it('AddressValid should return true if full address is passed in', () => {
    comp['participantAddress'] = MockTestData.getAnAddress();
    let result = comp['isParticipantAddressValid']();
    expect(result).toBe(true);
  });

  it('AddressValid should return true if address has one of city, state, or zip is filled out', () => {
    let address: Address = MockTestData.getAnAddress();
    address.addressLine1 = null;
    address.addressLine2 = null;
    comp['participantAddress'] = address;

    let result = comp['isParticipantAddressValid']();
    expect(result).toBe(true);

    address.city = null;
    address.state = null;
    console.log(comp['participantAddress']);
    result = comp['isParticipantAddressValid']();
    expect(result).toBe(true);

    address.city = 'Trenton';
    address.zip = null;
    result = comp['isParticipantAddressValid']();
    expect(result).toBe(true);

    address.city = null;
    address.state = 'Ohio';
    result = comp['isParticipantAddressValid']();
    expect(result).toBe(true);
  });

  it('should set new role', () => {
    comp['selectedRole'] = GroupRole.MEMBER;
    comp.onSelectRole(GroupRole.APPRENTICE);
    expect(comp['selectedRole']).toBe(GroupRole.APPRENTICE);
  });

  it('should saveChanges', () => {
    comp['groupId'] = 123;
    comp['selectedRole'] = 44;
    comp['leaderCount'] = 1;
    comp['apprenticeCount'] = 1;
    comp['participant'] = MockTestData.getAParticipantsArray()[1];

    (mockParticipantService.updateParticipantRole).and.returnValue(Observable.of(true));

    comp.saveChanges();
    expect(mockParticipantService.updateParticipantRole).toHaveBeenCalled();
  });

  it('AddressValid should return false when there is no object or all of zip, city, and state are null', () => {
    comp['participantAddress'] = null;
    let result = comp['isParticipantAddressValid']();
    console.log('result 1: ' + result);
    expect(result).toBe(false);

    comp['participantAddress'] = undefined;
    result = comp['isParticipantAddressValid']();
    console.log('result 2: ' + result);
    expect(result).toBe(false);

    let address = MockTestData.getAnAddress();
    address.state = null;
    address.city = null;
    address.zip = null;
    comp['participantAddress'] = address;
    result = comp['isParticipantAddressValid']();
    console.log('result 3: ' + result);
    expect(result).toBe(false);
  });

  describe('saveChanges() Method', () => {
    it('should assign a role if the max participants in the role have not been reached', () => {
      spyOn(comp, 'content');
      spyOn(comp, 'participantService');
      (mockParticipantService.updateParticipantRole).and.returnValue(Observable.of(true));

      comp['leaderCount'] = MaxGroupLeaders - 1;
      comp['apprenticeCount'] = MaxGroupApprentices - 1;
      comp['participant'] = MockTestData.getAParticipantsArray()[1];
      comp['participant'].groupRoleId = GroupRole.MEMBER;

      // Expect that making a participant an apprentice succeeds:
      comp['selectedRole'] = GroupRole.APPRENTICE;
      comp.saveChanges();
      expect(comp['content'].getContent).not.toHaveBeenCalledWith('finderMaxApprenticeExceeded');  // Expect growl was not displayed
      expect(comp['participantService'].updateParticipantRole).toHaveBeenCalledWith(comp['groupId'], comp['participant'].participantId, GroupRole.APPRENTICE);

      // Expect that making a participant a leader succeeds:
      comp['selectedRole'] = GroupRole.LEADER;
      comp.saveChanges();
      expect(comp['content'].getContent).not.toHaveBeenCalledWith('finderMaxLeadersExceeded');  // Expect growl was not displayed
      expect(comp['participantService'].updateParticipantRole).toHaveBeenCalledWith(comp['groupId'], comp['participant'].participantId, GroupRole.LEADER);
    });

    it('should display an error (growl) when assigning to a role which is already at max participants', () => {
      spyOn(comp, 'content');
      spyOn(comp, 'participantService');
      (mockParticipantService.updateParticipantRole).and.returnValue(Observable.of(true));

      comp['leaderCount'] = MaxGroupLeaders;
      comp['apprenticeCount'] = MaxGroupApprentices;
      comp['participant'] = MockTestData.getAParticipantsArray()[1];
      comp['participant'].groupRoleId = GroupRole.MEMBER;

      // Expect that making a participant an apprentice fails:
      comp['selectedRole'] = GroupRole.APPRENTICE;
      comp.saveChanges();
      expect(comp['content'].getContent).toHaveBeenCalledWith('finderMaxApprenticeExceeded');  // Expect growl was displayed
      expect(comp['participantService'].updateParticipantRole).not.toHaveBeenCalled();

      // Expect that making a participant a leader fails:
      comp['selectedRole'] = GroupRole.LEADER;
      comp.saveChanges();
      expect(comp['content'].getContent).toHaveBeenCalledWith('finderMaxLeadersExceeded');  // Expect growl was displayed
      expect(comp['participantService'].updateParticipantRole).not.toHaveBeenCalled();
    });

    it('should still "reassign" a participant into the same role when there is the max number of participants in that role', () => {
      spyOn(comp, 'content');
      spyOn(comp, 'participantService');
      (mockParticipantService.updateParticipantRole).and.returnValue(Observable.of(true));

      comp['leaderCount'] = MaxGroupLeaders;
      comp['apprenticeCount'] = MaxGroupApprentices;
      comp['participant'] = MockTestData.getAParticipantsArray()[1];

      // Expect that reassigning an apprentice as an apprentice succeeds:
      comp['participant'].groupRoleId = GroupRole.APPRENTICE;
      comp['selectedRole'] = GroupRole.APPRENTICE;
      comp.saveChanges();
      expect(comp['content'].getContent).not.toHaveBeenCalledWith('finderMaxApprenticeExceeded');  // Expect growl was not displayed
      expect(comp['participantService'].updateParticipantRole).not.toHaveBeenCalled();

      // Expect that reassigning an leader as an leader succeeds:
      comp['participant'].groupRoleId = GroupRole.LEADER;
      comp['selectedRole'] = GroupRole.LEADER;
      comp.saveChanges();
      expect(comp['content'].getContent).not.toHaveBeenCalledWith('finderMaxLeadersExceeded');  // Expect growl was not displayed
      expect(comp['participantService'].updateParticipantRole).not.toHaveBeenCalled();
    });
  });
});
