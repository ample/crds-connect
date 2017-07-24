import { ProfileService } from '../../services/profile.service';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { LookupService } from '../../services/lookup.service';
import { attributeTypes, defaultGroupMeetingTime, groupMeetingScheduleType, GroupRole } from '../../shared/constants';
import { MockTestData } from '../../shared/MockTestData';
import { CreateGroupService } from './create-group-data.service';
import { SessionService } from '../../services/session.service';
import { Group, Participant, Pin, pinType } from '../../models';
import * as moment from 'moment';

describe('CreateGroupService', () => {
    let service;
    let mockLookupService, mockSessionService, mockProfileService;

    beforeEach(() => {
        mockLookupService = jasmine.createSpyObj<LookupService>('lookupService', ['getCategories']);
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId']);
        mockProfileService = jasmine.createSpyObj<ProfileService>('profileService', ['getProfileData']);
        TestBed.configureTestingModule({
            providers: [
                CreateGroupService,
                { provide: LookupService, useValue: mockLookupService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: ProfileService, useValue: mockProfileService }
            ]
        });
    });

    it('should create the create group service',
        inject([CreateGroupService], (s: CreateGroupService) => {
            expect(s).toBeTruthy();
            // expect('1').toEqual(1);
        })
    );


    it('should initialize page one from uninitialized state',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            (mockLookupService.getCategories).and.returnValue(Observable.of(categories));
            (mockSessionService.getContactId).and.returnValue(4);

            s.initializePageOne().subscribe(result => {
                expect(result).toBe(categories);
                expect(s.categories).toBe(categories);
                expect(mockLookupService.getCategories).toHaveBeenCalledTimes(1);
                expect(s.group).toBeTruthy();
                expect(s.group.contactId).toBe(4);
                expect(mockSessionService.getContactId).toHaveBeenCalled();
            });
        })
    );

    it('should initialize page one from initialized state',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            s.categories = categories;
            s['pageOneInitialized'] = true;

            s.initializePageOne().subscribe(result => {
                expect(result).toBe(categories);
                expect(s.categories).toBe(categories);
                expect(mockLookupService.getCategories).not.toHaveBeenCalled();
            });
        })
    );

    it('should validate selected groups and return valid as true and set selectedCategories',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            s.categories = categories;
            s['pageOneInitialized'] = true;
            s.categories[0].selected = true;
            s.categories[1].selected = true;
            let value = s.validateCategories();
            expect(value).toBe(true);
            expect(s['selectedCategories'].length).toBe(2);
        })
    );

    it('should validate selected groups and return valid as false',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            s.categories = categories;
            s['pageOneInitialized'] = true;
            s.categories[0].selected = true;
            s.categories[1].selected = true;
            s.categories[2].selected = true;
            let value = s.validateCategories();
            expect(value).toBe(false);
            expect(s['selectedCategories'].length).toBe(3);
        })
    );

    it('should add attributes to group model',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            s.group = Group.overload_Constructor_CreateGroup(4);
            s.categories = categories;
            s['pageOneInitialized'] = true;
            s.categories[0].selected = true;
            s.categories[1].selected = true;
            s.validateCategories();
            s.addSelectedCategoriesToGroupModel();
            expect(s.group.attributeTypes[attributeTypes.GroupCategoryAttributeTypeId].attributeTypeId).toBe(attributeTypes.GroupCategoryAttributeTypeId);
            expect(s.group.attributeTypes[attributeTypes.GroupCategoryAttributeTypeId].name).toBe('Group Category');
            expect(s.group.attributeTypes[attributeTypes.GroupCategoryAttributeTypeId].attributes.length).toBe(2);
        })
    );

    it('should add groupGenderMixType to groupModel',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let groupGenderMixTypes = MockTestData.getGroupGenderMixAttributeTypeWithAttributes().attributes;
            s.selectedGroupGenderMix = groupGenderMixTypes[0];
            s.group = Group.overload_Constructor_CreateGroup(4);
            s.addGroupGenderMixTypeToGroupModel();
            expect(s.group.singleAttributes[attributeTypes.GroupGenderMixTypeAttributeId]).toBeTruthy();
            expect(s.group.singleAttributes[attributeTypes.GroupGenderMixTypeAttributeId].attribute.attributeId).toBe(1);
        })
    );

    it('should add ageRanges to groupModel',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let ageRanges = MockTestData.getAgeRangeAttributeTypeWithAttributes().attributes;
            s.selectedAgeRanges = [ageRanges[0]];
            s.group = Group.overload_Constructor_CreateGroup(4);
            s.addAgeRangesToGroupModel();
            expect(s.group.attributeTypes[attributeTypes.AgeRangeAttributeTypeId].attributes[0].attributeId).toBe(7089);
        })
    );

    it('should return participant with data from profileData',
        inject([CreateGroupService], (s: CreateGroupService) => {
            s.profileData = MockTestData.getProfileData();

            let result: Participant = s.getLeaders()[0];
            expect(result.nickName).toBe(s.profileData.nickName);
            expect(result.lastName).toBe(s.profileData.lastName);
        })
    );

    it('should create pin from group and profile data',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let profileData = MockTestData.getProfileData();
            s.profileData = profileData;
            s.group = MockTestData.getAGroup();
            s.group.address = MockTestData.getAnAddress(20);
            s.selectedAgeRanges = [MockTestData.getAgeRangeAttributeTypeWithAttributes().attributes[1]];
            s['selectedCategories'] = [MockTestData.getSomeCategories()[1]];
            s['selectedCategories'][0].categoryDetail = 'This is the detail';
            s.selectedGroupGenderMix = MockTestData.getGroupGenderMixAttributeTypeWithAttributes().attributes[0];
            let result: Pin = s.getSmallGroupPinFromGroupData();
            expect(result.firstName).toBe(profileData.nickName);
            expect(result.lastName).toBe(profileData.lastName);
            expect(result.emailAddress).toBe(profileData.emailAddress);
            expect(result.contactId).toBe(profileData.contactId);
            expect(result.gathering.groupId).toEqual(s.group.groupId);
            expect(result.householdId).toBe(profileData.householdId);
            expect(result.pinType).toBe(pinType.SMALL_GROUP);
            expect(result.gathering.categories[0]).toBe('Category #1:This is the detail');
            expect(result.gathering.ageRanges[0]).toBe('High Scho');
            expect(result.gathering.groupType).toBe('Errbody welcome');
        })
    );

    it('should set participants to an array with the leader you pass in',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let group = MockTestData.getAGroup(30);
            group.Participants = null;
            let participant = MockTestData.getAParticipantsArray()[1];
            s.setParticipants(participant, group);
            expect(group.Participants.length).toBe(1);
            expect(group.Participants[0].groupRoleId).toBe(GroupRole.LEADER);
        })
    );

    it('should prepare group for submission isVirtualGroup false',
        inject([CreateGroupService], (s: CreateGroupService) => {
            s.group = MockTestData.getAGroup();
            s.group.address = MockTestData.getAnAddress();
            s.group.isVirtualGroup = false;
            spyOn(s, 'formatTimesAndDates');
            let result = s.prepareForGroupSubmission();
            expect(result.groupId).toBe(s.group.groupId);
            expect(result.address).not.toBeNull();
            expect(s['formatTimesAndDates']).toHaveBeenCalled();
        })
    );

     it('should prepare group for submission isVirtualGroup true',
        inject([CreateGroupService], (s: CreateGroupService) => {
            s.group = MockTestData.getAGroup();
            s.group.address = MockTestData.getAnAddress();
            s.group.isVirtualGroup = true;
            spyOn(s, 'formatTimesAndDates');
            let result = s.prepareForGroupSubmission();
            expect(result.groupId).toBe(s.group.groupId);
            expect(result.address).toBeNull();
            expect(s['formatTimesAndDates']).toHaveBeenCalled();
        })
    );

    it('format times and dates flexible meeting schedule',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let group = MockTestData.getAGroup();
            group.meetingDay = 'Blah!';
            group.meetingDayId = 3;
            group.meetingFrequencyId = 2;
            group.meetingFrequency = 'At times';
            group.meetingTime = '3 PM';
            s.meetingTimeType = groupMeetingScheduleType.FLEXIBLE;
            group.startDate = moment(defaultGroupMeetingTime).format();
            s['formatTimesAndDates'](group);
            expect(group.meetingDayId).toBeNull();
            expect(group.meetingDay).toBeNull();
            expect(group.meetingFrequency).toBeNull();
            expect(group.meetingFrequencyId).toBeNull();
            expect(group.meetingTime).toBeNull();
            expect(group.startDate).toBe('1983-07-16T17:00:00Z');
        })
    );

    it('format times and dates specific meeting schedule',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let group = MockTestData.getAGroup();
            group.meetingDay = 'Blah!';
            group.meetingDayId = 3;
            group.meetingFrequencyId = 2;
            group.meetingFrequency = 'At times';
            group.meetingTime = defaultGroupMeetingTime;
            s.meetingTimeType = 'specific';
            group.startDate = moment(defaultGroupMeetingTime).format();
            s['formatTimesAndDates'](group);
            expect(group.meetingDayId).not.toBeNull();
            expect(group.meetingDay).not.toBeNull();
            expect(group.meetingFrequency).not.toBeNull();
            expect(group.meetingFrequencyId).not.toBeNull();
            expect(group.meetingTime).not.toBeNull();
            expect(group.startDate).toBe('1983-07-16T17:00:00Z');
            expect(group.meetingTime).toBe('5:00 PM');
        })
    );

});
