import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { Observable } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr';

import { ProfileService } from '../../../services/profile.service';
import { GroupService } from '../../../services/group.service';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';
import { BlandPageService } from '../../../services/bland-page.service';
import { ParticipantService } from '../../../services/participant.service';
import { Pin, pinType, Group } from '../../../models';
import { MockTestData } from '../../../shared/MockTestData';
import { MockComponent } from '../../../shared/mock.component';
import { ViewType } from '../../../shared/constants';


import { CreateGroupPreviewComponent } from './create-group-preview.component';

describe('CreateGroupPreviewComponent', () => {
    let fixture: ComponentFixture<CreateGroupPreviewComponent>;
    let comp: CreateGroupPreviewComponent;
    let el;
    let mockCreateGroupService, mockStateService, mockGroupService,
        mockProfileService, mockRouter, mockToastr, mockParticipantService,
        mockBlandPageService, mockContentService;
    beforeEach(() => {
        mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('cgs', ['getSmallGroupPinFromGroupData', 'getLeaders', 'setParticipants', 'prepareForGroupSubmission', 'reset']);
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader', 'setIsMyStuffActive', 'setCurrentView', 'getActiveGroupPath']);
        mockGroupService = jasmine.createSpyObj<GroupService>('groupServ', ['createGroup', 'createParticipants']);
        mockProfileService = jasmine.createSpyObj<ProfileService>('profile', ['postProfileData']);
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
        mockToastr = jasmine.createSpyObj<ToastsManager>('toastr', ['success', 'error']);
        mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantServ', ['getLoggedInUsersParticipantRecord']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('bpd', ['goToDefaultError']);
        mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);
        mockStateService.postedPin = null;
        mockCreateGroupService.group = MockTestData.getAGroup();
        mockCreateGroupService.profileData = MockTestData.getProfileData();
        mockRouter = {
            url: '/groupsv2/create-group/create-group-preview',
            navigate: jasmine.createSpy('navigate')
        };

        TestBed.configureTestingModule({
            declarations: [
                CreateGroupPreviewComponent,
                MockComponent({selector: 'crds-content-block', inputs: ['id']})
            ],
            providers: [
                { provide: CreateGroupService, useValue: mockCreateGroupService },
                { provide: StateService, useValue: mockStateService },
                { provide: GroupService, useValue: mockGroupService },
                { provide: ProfileService, useValue: mockProfileService },
                { provide: Router, useValue: mockRouter },
                { provide: ToastsManager, useValue: mockToastr },
                { provide: ParticipantService, useValue: mockParticipantService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: ContentService, useValue: mockContentService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CreateGroupPreviewComponent);
            comp = fixture.componentInstance;

        });
    }));

    it('should create an instance', () => {
        fixture.detectChanges();
        (mockCreateGroupService.getSmallGroupPinFromGroupData).and.returnValue(MockTestData.getAPin(1, 4, pinType.SMALL_GROUP));
        (mockCreateGroupService.getLeaders).and.returnValue(MockTestData.getAParticipantsArray(1));
        expect(comp).toBeTruthy();
    });

    it('should Init', () => {
        let pin = MockTestData.getAPin(1, 4, pinType.SMALL_GROUP);
        let leaders = MockTestData.getAParticipantsArray(1);
        (mockCreateGroupService.getSmallGroupPinFromGroupData).and.returnValue(pin);
        (mockCreateGroupService.getLeaders).and.returnValue(leaders);
        comp.ngOnInit();
        expect(mockCreateGroupService.getSmallGroupPinFromGroupData).toHaveBeenCalled();
        expect(mockCreateGroupService.getLeaders).toHaveBeenCalled();
        expect(mockStateService.setLoading).toHaveBeenCalled();
        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('start a group', '/create-group/page-6');
        expect(comp['leaders']).toBe(leaders);
        expect(comp['smallGroupPin']).toBe(pin);
    });

    it('should create group', () => {
        let profileData = MockTestData.getProfileData();
        comp['createGroupService'].profileData = profileData;
        let participant = MockTestData.getAParticipantsArray(1);
        (mockParticipantService.getLoggedInUsersParticipantRecord).and.returnValue(Observable.of(participant));
        (mockGroupService.createGroup).and.returnValue(Observable.of(mockCreateGroupService.group));
        (mockCreateGroupService.prepareForGroupSubmission).and.returnValue(mockCreateGroupService.group);
        (mockProfileService.postProfileData).and.returnValue(Observable.of({}));
        (mockGroupService.createParticipants).and.returnValue(Observable.of({}));
        comp['onSubmit']();
        expect(mockGroupService.createGroup).toHaveBeenCalled();
        expect(mockParticipantService.getLoggedInUsersParticipantRecord).toHaveBeenCalled();
        expect(mockCreateGroupService.setParticipants).toHaveBeenCalled();
        expect(mockProfileService.postProfileData).toHaveBeenCalledWith(profileData);
        expect(mockCreateGroupService.setParticipants).toHaveBeenCalledWith(participant, mockCreateGroupService.group);
        expect(mockGroupService.createParticipants).toHaveBeenCalled();
        expect(mockStateService.setLoading).toHaveBeenCalled();
        expect(mockToastr.success).toHaveBeenCalledWith('Successfully created group!');
        expect(mockStateService.setIsMyStuffActive).toHaveBeenCalledWith(true);
        expect(mockStateService.setCurrentView).toHaveBeenCalledWith(ViewType.LIST);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
        expect(mockCreateGroupService.prepareForGroupSubmission).toHaveBeenCalled();
        expect(mockCreateGroupService.reset).toHaveBeenCalled();
    });

    it('should handle error on create group', () => {
        let profileData = MockTestData.getProfileData();
        comp['createGroupService'].profileData = profileData;
        let participant = MockTestData.getAParticipantsArray(1);
        (mockCreateGroupService.prepareForGroupSubmission).and.returnValue(mockCreateGroupService.group);
        (mockParticipantService.getLoggedInUsersParticipantRecord).and.returnValue(Observable.throw({error: 'bad'}));
        (mockGroupService.createGroup).and.returnValue(Observable.of(mockCreateGroupService.group));
        (mockProfileService.postProfileData).and.returnValue(Observable.of({}));
        (mockContentService.getContent).and.returnValue('stuff dont work');
        comp['onSubmit']();
        expect(mockCreateGroupService.prepareForGroupSubmission).toHaveBeenCalled();
        expect(mockToastr.success).not.toHaveBeenCalled();
        expect(mockToastr.error).toHaveBeenCalledWith('stuff dont work');
        expect(mockContentService.getContent).toHaveBeenCalledWith('generalError');
        expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('/create-group/preview');
        expect(mockCreateGroupService.reset).not.toHaveBeenCalled();

    });

    it('should go back', () => {
        comp.onBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-group/page-6']);
    });
});
