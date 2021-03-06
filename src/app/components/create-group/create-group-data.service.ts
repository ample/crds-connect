import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Address, Attribute, AttributeType, Group, Pin, pinType, Participant } from '../../models';
import { Category } from '../../models/category';
import { GroupEditPresetTracker } from '../../models/group-edit-preset-tracker';
import { LookupService } from '../../services/lookup.service';
import { ProfileService } from '../../services/profile.service';
import { SessionService } from '../../services/session.service';
import { ParticipantService } from '../../services/participant.service';

import {
  attributeTypes,
  GroupPageNumber,
  GroupRole,
  groupMeetingScheduleType,
  GroupPaths,
  groupPaths
} from '../../shared/constants';
import * as _ from 'lodash';
import * as moment from 'moment';
import { UtcTimeFormatPipe } from '../../pipes/utc-time-format.pipe';

import { Router, ActivatedRoute } from '@angular/router';

import {} from '../../shared/constants';

@Injectable()
export class CreateGroupService {
  private pageOneInitialized: boolean = false;
  private pageSixInitialized: boolean = false;
  public meetingTimeType: string = groupMeetingScheduleType.SPECIFIC_TIME_AND_DATE;

  public categories: Category[] = [];
  private selectedCategories: Category[] = [];
  public groupBeingEdited: Group;
  public group: Group;
  public profileData: any = {};
  public wasPagePresetWithExistingData: GroupEditPresetTracker;

  public selectedGroupGenderMix: Attribute = Attribute.constructor_create_group();
  public selectedAgeRanges: Attribute[] = [];

  constructor(
    private lookupService: LookupService,
    private session: SessionService,
    private profileService: ProfileService,
    private participantService: ParticipantService,
    private router: Router,
    private utcTimePipe: UtcTimeFormatPipe
  ) {
    this.wasPagePresetWithExistingData = new GroupEditPresetTracker();
  }

  public setGroupFieldsFromGroupBeingEdited(groupBeingEdited: Group): void {
    this.groupBeingEdited = groupBeingEdited;
    this.group.groupId = groupBeingEdited.groupId;
    this.group.groupName = groupBeingEdited.groupName;
    this.group.groupDescription = groupBeingEdited.groupDescription;
    this.group.availableOnline = this.groupBeingEdited.availableOnline;
    this.group.primaryContactId = this.groupBeingEdited.contactId;
    this.group.contactId = this.groupBeingEdited.contactId;
    this.group.meetingTime = `0001-01-01T${this.groupBeingEdited.meetingTime}Z`;
  }

  public initializePageOne(): Observable<Category[]> {
    if (!this.pageOneInitialized) {
      this.group = Group.overload_Constructor_CreateGroup(this.session.getContactId());
      return this.lookupService.getCategories().do((cats: Category[]) => {
        this.categories = cats;
        this.pageOneInitialized = true;
      });
    } else {
      return Observable.of(this.categories);
    }
  }

  public initializePageSix(): Observable<any> {
    if (!this.pageSixInitialized) {
      return this.profileService.getProfileData().map((response: any) => {
        response.congregationId = null;
        this.profileData = response;
        this.pageSixInitialized = true;
      });
    } else {
      return Observable.of(this.profileData);
    }
  }

  public isMaxNumberOfCategoriesSelected(): boolean {
    let isMaxNumberOfCatsSelected: boolean = this.selectedCategories.length === 2;
    return isMaxNumberOfCatsSelected;
  }

  public validateCategories(): boolean {
    this.selectedCategories = this.categories.filter(category => {
      return category.selected === true;
    });

    return this.selectedCategories.length > 0 && this.selectedCategories.length < 3;
  }

  public addSelectedCategoriesToGroupModel(): void {
    let attributes: Attribute[] = [];

    this.selectedCategories.forEach(cat => {
      attributes.push(this.createCategoryDetailAttribute(cat));
    });

    let jsonObject = {};

    jsonObject[attributeTypes.GroupCategoryAttributeTypeId] = {
      attributeTypeId: attributeTypes.GroupCategoryAttributeTypeId,
      name: 'Group Category',
      attributes: attributes
    };

    Object.assign(this.group.attributeTypes, this.group.attributeTypes, jsonObject);
  }

  public addGroupGenderMixTypeToGroupModel(): void {
    let jsonObject = {};

    jsonObject[attributeTypes.GroupGenderMixTypeAttributeId] = {
      attribute: this.selectedGroupGenderMix
    };
    this.group.singleAttributes = jsonObject;
  }

  public addAgeRangesToGroupModel(): void {
    let jsonObject = {};
    jsonObject[attributeTypes.AgeRangeAttributeTypeId] = {
      attributeTypeId: attributeTypes.AgeRangeAttributeTypeId,
      name: null,
      attributes: this.selectedAgeRanges
    };

    Object.assign(this.group.attributeTypes, this.group.attributeTypes, jsonObject);
  }

  public getSmallGroupPinFromGroupData(): Pin {
    let pin = new Pin(
      this.profileData.nickName,
      this.profileData.lastName,
      this.profileData.emailAddress,
      this.profileData.contactId,
      null,
      this.group.address,
      2,
      _.cloneDeep(this.group),
      null,
      pinType.SMALL_GROUP,
      0,
      this.profileData.householdId
    );

    this.selectedCategories.forEach(cat => {
      pin.gathering.categories.push(`${cat.name}:${cat.categoryDetail}`);
    });

    this.selectedAgeRanges.forEach(ageRange => {
      pin.gathering.ageRanges.push(ageRange.name);
    });

    pin.gathering.groupType = this.selectedGroupGenderMix.name;
    return pin;
  }

  public getLeaders(): Observable<Participant[]> {
    if (this.group.groupId === 0) {
      return Observable.of([
        new Participant(
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          true,
          this.profileData.lastName,
          this.profileData.nickName,
          null,
          null,
          true
        )
      ]);
    } else {
      return this.participantService.getAllLeaders(this.group.groupId);
    }
  }

  public setParticipants(participant: Participant, group: Group) {
    participant.groupRoleId = GroupRole.LEADER;
    group.Participants = [participant];
  }

  public prepareForGroupSubmission(): Group {
    let group = _.cloneDeep(this.group);
    if (group.isVirtualGroup) {
      group.address = null;
    }
    this.formatTimesAndDates(group);
    return group;
  }

  /*
    * This will clear meeting day, meeting time, and meeting frequency
    * if the group is flexible
    * else it will format the meeting time data the way it needs to be for submission
    */
  private formatTimesAndDates(group): void {
    if (this.meetingTimeType === groupMeetingScheduleType.FLEXIBLE) {
      group.meetingDayId = null;
      group.meetingFrequencyId = null;
      group.meetingTime = null;
      group.meetingDay = null;
      group.meetingFrequency = null;
    }
    group.meetingTime = this.utcTimePipe.transform(this.group.meetingTime);
    const startDate = moment(group.startDate);
    group.startDate = startDate
      .add(startDate.utcOffset(), 'm')
      .utc()
      .format();

    // set start date of categories to group start date.
    group.attributeTypes[attributeTypes.GroupCategoryAttributeTypeId].attributes.forEach(cat => {
      cat.startDate = group.startDate;
    });
  }

  private createCategoryDetailAttribute(category: Category): Attribute {
    let attribute = new Attribute(
      0,
      category.categoryDetail,
      category.desc,
      category.name,
      category.categoryId,
      null,
      0,
      attributeTypes.GroupCategoryAttributeTypeId,
      null,
      null
    );

    if (category.attribute != null) {
      attribute.startDate = category.attribute.startDate;
      attribute.endDate = category.attribute.endDate;
    }

    attribute.selected = true;

    return attribute;
  }

  public markPageAsPresetWithExistingData(pageNumber: GroupPageNumber): void {
    switch (pageNumber) {
      case GroupPageNumber.ONE:
        this.wasPagePresetWithExistingData.page1 = true;
        break;
      case GroupPageNumber.TWO:
        this.wasPagePresetWithExistingData.page2 = true;
        break;
      case GroupPageNumber.THREE:
        this.wasPagePresetWithExistingData.page3 = true;
        break;
      case GroupPageNumber.FOUR:
        this.wasPagePresetWithExistingData.page4 = true;
        break;
      case GroupPageNumber.FIVE:
        this.wasPagePresetWithExistingData.page5 = true;
        break;
      case GroupPageNumber.SIX:
        this.wasPagePresetWithExistingData.page6 = true;
        break;
    }
  }

  public clearPresetDataFlagsOnGroupEdit(): void {
    this.wasPagePresetWithExistingData = new GroupEditPresetTracker();
  }

  public reset(): void {
    this.pageOneInitialized = false;
    this.pageSixInitialized = false;
    this.profileData = {};
    this.group = Group.overload_Constructor_CreateGroup(0);
    this.selectedAgeRanges = [];
    this.selectedCategories = [];
    this.selectedGroupGenderMix = Attribute.constructor_create_group();
    this.categories = [];
    this.meetingTimeType = groupMeetingScheduleType.SPECIFIC_TIME_AND_DATE;
  }

  public navigateInGroupFlow(pageToGoTo: number, editOrCreateMode: string, groupId: number): void {
    if (editOrCreateMode === groupPaths.ADD) {
      this.router.navigate([`/create-group/page-${pageToGoTo}`]);
    } else if (editOrCreateMode === groupPaths.EDIT) {
      this.router.navigate([`/edit-group/${groupId}/page-${pageToGoTo}`]);
    }
  }
}
