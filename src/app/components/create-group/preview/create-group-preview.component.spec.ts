import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr';

import { CreateGroupPreviewComponent } from './create-group-preview.component';

import { ProfileService } from '../../../services/profile.service';
import { GroupInquiryService } from '../../../services/group-inquiry.service';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';
import { BlandPageService } from '../../../services/bland-page.service';
import { ParticipantService } from '../../../services/participant.service';
import { PinService } from '../../../services/pin.service';

import { Pin, pinType, Group } from '../../../models';

import { MockTestData } from '../../../shared/MockTestData';
import { MockComponent } from '../../../shared/mock.component';
import { ViewType, groupPaths, textConstants } from '../../../shared/constants';

describe('CreateGroupPreviewComponent', () => {
  let fixture: ComponentFixture<CreateGroupPreviewComponent>;
  let comp: CreateGroupPreviewComponent;
  let el;
  let mockCreateGroupService,
    mockStateService,
    mockProfileService,
    mockRouter,
    mockToastr,
    mockParticipantService,
    mockBlandPageService,
    mockContentService,
    mockPinService;
  beforeEach(() => {
    mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('cgs', [
      'getSmallGroupPinFromGroupData',
      'getLeaders',
      'setParticipants',
      'prepareForGroupSubmission',
      'reset',
      'navigateInGroupFlow'
    ]);
    mockStateService = jasmine.createSpyObj<StateService>('state', [
      'setLoading',
      'setPageHeader',
      'setIsMyStuffActive',
      'setCurrentView',
      'getActiveGroupPath',
      'setActiveGroupPath'
    ]);
    mockProfileService = jasmine.createSpyObj<ProfileService>('profile', ['postProfileData']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    mockToastr = jasmine.createSpyObj<ToastsManager>('toastr', ['success', 'error']);
    mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantServ', [
      'getLoggedInUsersParticipantRecord',
      'getAllLeaders'
    ]);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('bpd', ['goToDefaultError']);
    mockStateService.postedPin = null;
    mockStateService.setActiveGroupPath(groupPaths.ADD);
    mockCreateGroupService.group = MockTestData.getAGroup();
    mockCreateGroupService.profileData = MockTestData.getProfileData();
    mockPinService = jasmine.createSpyObj<PinService>('pinService', [
      'setEditedSmallGroupPin',
      'getEditedSmallGroupPin'
    ]);

    TestBed.configureTestingModule({
      declarations: [CreateGroupPreviewComponent, MockComponent({ selector: 'crds-content-block', inputs: ['id'] })],
      providers: [
        { provide: CreateGroupService, useValue: mockCreateGroupService },
        { provide: StateService, useValue: mockStateService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: PinService, useValue: mockPinService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastsManager, useValue: mockToastr },
        { provide: ParticipantService, useValue: mockParticipantService },
        { provide: BlandPageService, useValue: mockBlandPageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(
    async(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(CreateGroupPreviewComponent);
        comp = fixture.componentInstance;
      });
    })
  );

  it('should create group', () => {
    let profileData = MockTestData.getProfileData();
    comp['createGroupService'].profileData = profileData;
    comp['createGroupService']['groupBeingEdited'] = new Group();
    comp['createGroupService']['groupBeingEdited']['startDate'] = '123';
    let participant = MockTestData.getAParticipantsArray(1);
    mockParticipantService.getLoggedInUsersParticipantRecord.and.returnValue(Observable.of(participant));
    mockCreateGroupService.createGroup.and.returnValue(Observable.of(mockCreateGroupService.group));
    mockCreateGroupService.prepareForGroupSubmission.and.returnValue(mockCreateGroupService.group);
    mockProfileService.postProfileData.and.returnValue(Observable.of({}));
    mockCreateGroupService.createParticipants.and.returnValue(Observable.of({}));
    mockStateService.getActiveGroupPath.and.returnValue(groupPaths.ADD);
    comp['onSubmit']();
    expect(mockCreateGroupService.createGroup).toHaveBeenCalled();
    expect(mockParticipantService.getLoggedInUsersParticipantRecord).toHaveBeenCalled();
    expect(mockCreateGroupService.setParticipants).toHaveBeenCalled();
    expect(mockProfileService.postProfileData).toHaveBeenCalledWith(profileData);
    expect(mockCreateGroupService.setParticipants).toHaveBeenCalledWith(participant, mockCreateGroupService.group);
    expect(mockCreateGroupService.createParticipants).toHaveBeenCalled();
    expect(mockStateService.setLoading).toHaveBeenCalled();
    expect(mockToastr.success).toHaveBeenCalledWith('Successfully created group!');
    expect(mockStateService.setIsMyStuffActive).toHaveBeenCalledWith(true);
    expect(mockStateService.setCurrentView).toHaveBeenCalledWith(ViewType.LIST);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(mockCreateGroupService.prepareForGroupSubmission).toHaveBeenCalled();
    expect(mockCreateGroupService.reset).toHaveBeenCalled();
  });

  it('should handle error on create group', () => {
    const profileData = MockTestData.getProfileData();
    comp['createGroupService'].profileData = profileData;
    comp['createGroupService']['groupBeingEdited'] = new Group();
    comp['createGroupService']['groupBeingEdited']['startDate'] = '123';
    const participant = MockTestData.getAParticipantsArray(1);
    mockCreateGroupService.prepareForGroupSubmission.and.returnValue(mockCreateGroupService.group);
    mockParticipantService.getLoggedInUsersParticipantRecord.and.returnValue(Observable.throw({ error: 'bad' }));
    mockCreateGroupService.createGroup.and.returnValue(Observable.of(mockCreateGroupService.group));
    mockProfileService.postProfileData.and.returnValue(Observable.of({}));
    mockContentService.getContent.and.returnValue(Observable.of({ content: 'stuff dont work' }));
    mockStateService.getActiveGroupPath.and.returnValue(groupPaths.ADD);
    comp['onSubmit']();
    expect(mockCreateGroupService.prepareForGroupSubmission).toHaveBeenCalled();
    expect(mockToastr.success).not.toHaveBeenCalled();
    expect(mockToastr.error).toHaveBeenCalledWith('stuff dont work');
    expect(mockContentService.getContent).toHaveBeenCalledWith('finderGeneralError');
    expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('/create-group/preview');
    expect(mockCreateGroupService.reset).not.toHaveBeenCalled();
  });

  it('should go back', () => {
    comp.onBack();
    expect(mockCreateGroupService.navigateInGroupFlow).toHaveBeenCalledWith(6, undefined, 1);
  });
});
