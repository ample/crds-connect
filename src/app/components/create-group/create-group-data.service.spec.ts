import { ProfileService } from '../../services/profile.service';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { LookupService } from '../../services/lookup.service';
import { attributeTypes, defaultGroupMeetingTime, groupMeetingScheduleType, GroupRole } from '../../shared/constants';
import { MockTestData } from '../../shared/MockTestData';
import { CreateGroupService } from './create-group-data.service';
import { SessionService } from '../../services/session.service';
import { ParticipantService } from '../../services/participant.service';
import { Group, Participant, Pin, pinType } from '../../models';
import * as moment from 'moment';

describe('CreateGroupService', () => {
    let service;
    let mockLookupService, mockSessionService, mockProfileService, mockParticipantService;

    beforeEach(() => {
        mockLookupService = jasmine.createSpyObj<LookupService>('lookupService', ['getCategories']);
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId']);
        mockProfileService = jasmine.createSpyObj<ProfileService>('profileService', ['getProfileData']);
        mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantService', ['getAllLeaders']);
        TestBed.configureTestingModule({
            providers: [
                CreateGroupService,
                { provide: LookupService, useValue: mockLookupService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: ProfileService, useValue: mockProfileService },
                { provide: ParticipantService, useValue: mockParticipantService }
            ]
        });
    });

    it('should create the create group service',
        inject([CreateGroupService], (s: CreateGroupService) => {
            expect(s).toBeTruthy();
        })
    );


    it('should initialize page one from uninitialized state',
        inject([CreateGroupService], (s: CreateGroupService) => {
            const categories = MockTestData.getSomeCategories();
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
            const categories = MockTestData.getSomeCategories();
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
            const categories = MockTestData.getSomeCategories();
            s.categories = categories;
            s['pageOneInitialized'] = true;
            s.categories[0].selected = true;
            s.categories[1].selected = true;
            const value = s.validateCategories();
            expect(value).toBe(true);
            expect(s['selectedCategories'].length).toBe(2);
        })
    );

    it('should validate selected groups and return valid as false',
        inject([CreateGroupService], (s: CreateGroupService) => {
            const categories = MockTestData.getSomeCategories();
            s.categories = categories;
            s['pageOneInitialized'] = true;
            s.categories[0].selected = true;
            s.categories[1].selected = true;
            s.categories[2].selected = true;
            const value = s.validateCategories();
            expect(value).toBe(false);
            expect(s['selectedCategories'].length).toBe(3);
        })
    );

    it('should add attributes to group model',
        inject([CreateGroupService], (s: CreateGroupService) => {
            const categories = MockTestData.getSomeCategories();
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
            const groupGenderMixTypes = MockTestData.getGroupGenderMixAttributeTypeWithAttributes().attributes;
            s.selectedGroupGenderMix = groupGenderMixTypes[0];
            s.group = Group.overload_Constructor_CreateGroup(4);
            s.addGroupGenderMixTypeToGroupModel();
            expect(s.group.singleAttributes[attributeTypes.GroupGenderMixTypeAttributeId]).toBeTruthy();
            expect(s.group.singleAttributes[attributeTypes.GroupGenderMixTypeAttributeId].attribute.attributeId).toBe(1);
        })
    );

    it('should add ageRanges to groupModel',
        inject([CreateGroupService], (s: CreateGroupService) => {
            const ageRanges = MockTestData.getAgeRangeAttributeTypeWithAttributes().attributes;
            s.selectedAgeRanges = [ageRanges[0]];
            s.group = Group.overload_Constructor_CreateGroup(4);
            s.addAgeRangesToGroupModel();
            expect(s.group.attributeTypes[attributeTypes.AgeRangeAttributeTypeId].attributes[0].attributeId).toBe(7089);
        })
    );

    it('should return participant with data from profileData',
        inject([CreateGroupService], (s: CreateGroupService) => {
            s.profileData = MockTestData.getProfileData();

            s.group = new Group;
            s.group.groupId = 123;
            // const result: Participant = s.getLeaders()[0];
            let results: Participant;
            s.getLeaders()
            .subscribe(
              (leaders) => {
                expect(leaders[0].nickName).toBe(s.profileData.nickName);
                expect(leaders[0].lastName).toBe(s.profileData.lastName);
              },
              (error) => {
                console.log(error);
              }
            )
        })
    );

    it('should create pin from group and profile data',
        inject([CreateGroupService], (s: CreateGroupService) => {
            const profileData = MockTestData.getProfileData();
            s.profileData = profileData;
            s.group = MockTestData.getAGroup();
            s.group.address = MockTestData.getAnAddress(20);
            s.selectedAgeRanges = [MockTestData.getAgeRangeAttributeTypeWithAttributes().attributes[1]];
            s['selectedCategories'] = [MockTestData.getSomeCategories()[1]];
            s['selectedCategories'][0].categoryDetail = 'This is the detail';
            s.selectedGroupGenderMix = MockTestData.getGroupGenderMixAttributeTypeWithAttributes().attributes[0];
            const result: Pin = s.getSmallGroupPinFromGroupData();
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

    it('should format times and dates flexible meeting schedule',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            let group = MockTestData.getAGroup();
            group.attributeTypes = {};
            s.group = group;
            s.categories = categories;
            s['pageOneInitialized'] = true;
            s.categories[0].selected = true;
            s.categories[1].selected = true;
            s.validateCategories();
            s.addSelectedCategoriesToGroupModel();
            group = s.group;
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
            expect(group.startDate).toBe('0001-01-01T12:00:00Z');
        })
    );

    it('should format times and dates specific meeting schedule',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            let group = MockTestData.getAGroup();
            group.attributeTypes = {};
            s.group = group;
            s.categories = categories;
            s['pageOneInitialized'] = true;
            s.categories[0].selected = true;
            s.categories[1].selected = true;
            s.validateCategories();
            s.addSelectedCategoriesToGroupModel();
            group = s.group;
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
            expect(group.startDate).toBe('0001-01-01T12:00:00Z');
            expect(group.meetingTime).toBe('12:00 PM');
        })
    );

    it('should reset',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let group = MockTestData.getAGroup();
            group.meetingDay = 'Blah!';
            group.meetingDayId = 3;
            group.meetingFrequencyId = 2;
            group.meetingFrequency = 'At times';
            group.meetingTime = defaultGroupMeetingTime;
            s.meetingTimeType = 'flexible';
            s['pageOneInitialized'] = true;
            s['pageSixInitialized'] = true;
            group.startDate = moment(defaultGroupMeetingTime).format();
            s.group = group;
            s.reset();
            expect(s.group.meetingDay).toBeNull();
            expect(s['pageOneInitialized']).toBeFalsy();
            expect(s['pageSixInitialized']).toBeFalsy();
            expect(s.meetingTimeType).toBe('specific');
            expect(s.selectedAgeRanges.length).toBe(0);
            expect(s['selectedCategories'].length).toBe(0);
        })
    );

});
