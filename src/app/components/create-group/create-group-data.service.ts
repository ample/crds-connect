import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Address, Attribute, AttributeType, Group, Pin, pinType, Participant } from '../../models';
import { Category } from '../../models/category';
import { GroupEditPresetTracker } from '../../models/group-edit-preset-tracker';
import { LookupService } from '../../services/lookup.service';
import { ProfileService } from '../../services/profile.service';
import { SessionService } from '../../services/session.service';
import { attributeTypes, GroupPageNumber, GroupRole, groupMeetingScheduleType } from '../../shared/constants';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class CreateGroupService {
  public groupBeingEdited: Group;
  public group: Group;
  public profileData: any = {};
  public wasPagePresetWithExistingData: GroupEditPresetTracker;

  // ***** Page 1 Properties *****
  private pageOneInitialized: boolean = false;
  public categories: Category[] = [];
  private selectedCategories: Category[] = [];

  // ***** Page 2 Properties *****
  public meetingTimeType: string = groupMeetingScheduleType.SPECIFIC_TIME_AND_DATE;

  // ***** Page 4 Properties *****
  public selectedGroupGenderMix: Attribute = Attribute.constructor_create_group();
  public selectedAgeRanges: Attribute[] = [];

  // ***** Page 6 Properties *****
  private pageSixInitialized: boolean = false;

  // ********************
  // Constructor
  // ********************
  constructor(private lookupService: LookupService, private session: SessionService,
    private profileService: ProfileService) {
    this.wasPagePresetWithExistingData = new GroupEditPresetTracker();
  }

  public setGroupFieldsFromGroupBeingEdited(groupBeingEdited: Group): void {
    this.groupBeingEdited = groupBeingEdited;
    this.group.groupId = groupBeingEdited.groupId;
    this.group.groupName = groupBeingEdited.groupName;
    this.group.groupDescription = groupBeingEdited.groupDescription;
    this.group.availableOnline = this.groupBeingEdited.availableOnline;
  }

  public getSmallGroupPinFromGroupData(): Pin {
    const pin = new Pin(this.profileData.nickName, this.profileData.lastName, this.profileData.emailAddress, this.profileData.contactId,
              null, this.group.address, 2, _.cloneDeep(this.group), null, pinType.SMALL_GROUP, 0, this.profileData.householdId);

    this.selectedCategories.forEach((cat) => {
      pin.gathering.categories.push(`${cat.name}:${cat.categoryDetail}`);
    });

    this.selectedAgeRanges.forEach((ageRange) => {
      pin.gathering.ageRanges.push(ageRange.name);
    });

    pin.gathering.groupType = this.selectedGroupGenderMix.name;
    return pin;
  }

  public getLeaders(): Participant[] {
    const leaders: Participant[] = [];
    leaders.push(new Participant(null, null, null, null, null, null, null, true, this.profileData.lastName, this.profileData.nickName, null, null, true));
    return leaders;
  }

  public setParticipants(participant: Participant, group: Group) {
    participant.groupRoleId = GroupRole.LEADER;
    group.Participants = [participant];
  }

  public prepareForGroupSubmission(): Group {
    const group = _.cloneDeep(this.group);
    if (group.isVirtualGroup) {
      group.address = null;
    }
    this.formatTimesAndDates(group);
    return group;
  }

  public markPageAsPresetWithExistingData(pageNumber: GroupPageNumber): void{
    switch(pageNumber) {
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

  // ********************
  // Page 1 Methods
  // ********************
  public initializePageOne(): Observable<Category[]> {
    if (!this.pageOneInitialized) {
      // Get the contact ID:
      this.group = Group.overload_Constructor_CreateGroup(this.session.getContactId());

      // Get the available group categories:
      return this.lookupService.getCategories()
      .do((cats: Category[]) => {
        console.log(`Here: ${cats}`);
        this.categories = cats;
        // Get the selected categories:
        this.initializeSelectedCategories();
        // this.selectedCategories = this.categories.filter((category) => category.selected === true);
        // console.log(this.selectedCategories);
        this.pageOneInitialized = true;
      });
    } else {
      return Observable.of(this.categories);
    }
  }

  private initializeSelectedCategories(): void {
    console.log(`In initializeSelectedCategories`);
    // Get the attributes
    const attributes = this.groupBeingEdited.attributeTypes[attributeTypes.GroupCategoryAttributeTypeId.toString()].attributes
    // Filter out unselected attributes
    .filter((attribute) => attribute.selected === true)
    // Iterate through the attributes
    .forEach(attribute => {
      // Get the matching category
      const matchingCategory = this.categories.find(category => attribute.category === category.name)
      // Set the matching category's properties
      if (matchingCategory) {
        matchingCategory.selected = true;
        matchingCategory.categoryDetail = attribute.name;
        this.selectedCategories.push(matchingCategory);
      }
    })
  }

  public selectCategory(category: Category) {
    console.log(`In selectCategory`);
    this.selectedCategories.push(category);
  }

  public deselectCategory(category: Category) {
    console.log(`In deselecteCategory`);
    this.selectedCategories =
      this.selectedCategories.filter((currentCategory) => currentCategory.name !== category.name);
  }

  public isMaxNumberOfCategoriesSelected(): boolean {
    return this.selectedCategories.length === 2;
  }

  public validateCategories(): boolean {
    console.log(`in validateCategories: selectedCategories.length: ${this.selectedCategories.length}`)
    return (this.selectedCategories.length > 0 && this.selectedCategories.length < 3);
  }

  public addSelectedCategoriesToGroupModel(): void {
    const attributes: Attribute[] = this.selectedCategories
      .reduce((attributes, category) => [...attributes, this.createCategoryDetailAttribute(category)], []);

    const jsonObject = {};
    jsonObject[attributeTypes.GroupCategoryAttributeTypeId] = {
      attributeTypeId: attributeTypes.GroupCategoryAttributeTypeId,
      name: 'Group Category',
      attributes: attributes
    };

    Object.assign(this.group.attributeTypes, this.group.attributeTypes, jsonObject);
  }

  private createCategoryDetailAttribute(category: Category): Attribute {
    const attribute = new Attribute(0, category.categoryDetail, category.desc, category.name,
        category.categoryId, null, 0, attributeTypes.GroupCategoryAttributeTypeId,
        null, null);

    if (category.attribute != null) {
      attribute.startDate = category.attribute.startDate;
      attribute.endDate = category.attribute.endDate;
    }

    attribute.selected = true;

    return attribute;
  }

  // ********************
  // Page 2 Methods
  // ********************
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
    } else {
      group.meetingTime = moment(group.meetingTime).format('LT');
    }
    const startDate = moment(group.startDate);
    group.startDate = startDate.add(startDate.utcOffset(), 'm').utc().format();

    // set start date of categories to group start date.
    group.attributeTypes[attributeTypes.GroupCategoryAttributeTypeId].attributes.forEach((cat) => {
      cat.startDate = group.startDate;
    });
  }

  // ********************
  // Page 4 Methods
  // ********************
  public addGroupGenderMixTypeToGroupModel(): void {
    const jsonObject = {};
    jsonObject[attributeTypes.GroupGenderMixTypeAttributeId] = {
      attribute: this.selectedGroupGenderMix
    };
    this.group.singleAttributes = jsonObject;
  }

  public addAgeRangesToGroupModel(): void {
    const jsonObject = {};
    jsonObject[attributeTypes.AgeRangeAttributeTypeId] = {
      attributeTypeId: attributeTypes.AgeRangeAttributeTypeId,
      name: null,
      attributes: this.selectedAgeRanges
    };

    Object.assign(this.group.attributeTypes, this.group.attributeTypes, jsonObject);
  }

  // ********************
  // Page 6 Methods
  // ********************
  public initializePageSix(): Observable<any> {
    if (!this.pageSixInitialized) {
      return this.profileService.getProfileData()
        .map((response: any) => {
          response.congregationId = null;
          this.profileData = response;
          this.pageSixInitialized = true;
        });
    } else {
      return Observable.of(this.profileData);
    }
  }
}
