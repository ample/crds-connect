import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { LookupService } from '../../services/lookup.service';
import { attributeTypes } from '../../shared/constants';
import { MockTestData } from '../../shared/MockTestData';
import { CreateGroupService } from './create-group-data.service';
import { SessionService } from '../../services/session.service';
import { Group } from '../../models';

describe('CreateGroupService', () => {
    let service;
    let mockLookupService, mockSessionService;

    beforeEach(() => {
        mockLookupService = jasmine.createSpyObj<LookupService>('lookupService', ['getCategories']);
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId']);
        TestBed.configureTestingModule({
            providers: [
                CreateGroupService,
                { provide: LookupService, useValue: mockLookupService },
                { provide: SessionService, useValue: mockSessionService }
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

    it('should clear meeting time data',
        inject([CreateGroupService], (s: CreateGroupService) => {
            s.group = Group.overload_Constructor_CreateGroup(4);
            s.group.meetingDay = 'Thorsday';
            s.group.meetingDayId = 1;
            s.group.meetingFrequency = 'all the time';
            s.group.meetingFrequencyId = 6;
            s.group.meetingTime = 'that one time';
            s.clearMeetingTimeData();
            expect(s.group.meetingDay).toBeNull();
            expect(s.group.meetingDayId).toBeNull();
            expect(s.group.meetingFrequency).toBeNull();
            expect(s.group.meetingFrequencyId).toBeNull();
            expect(s.group.meetingTime).toBeNull();
        })
    );
});
