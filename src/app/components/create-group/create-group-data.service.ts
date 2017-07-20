import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Address, Attribute, AttributeType, Group, Pin, pinType, Participant } from '../../models';
import { Category } from '../../models/category';
import { LookupService } from '../../services/lookup.service';
import { ProfileService } from '../../services/profile.service';
import { SessionService } from '../../services/session.service';
import { attributeTypes } from '../../shared/constants';
import * as _ from 'lodash';

@Injectable()
export class CreateGroupService {
    private pageOneInitialized: boolean = false;
    private pageSixInitialized: boolean = false;
    public meetingTimeType: string = 'specific';
    public meetingIsInPerson: boolean = true;

    public categories: Category[] = [];
    private selectedCategories: Category[] = [];
    public group: Group;
    public profileData: any = {};

    public selectedGroupGenderMix: Attribute = Attribute.constructor_create_group();
    public selectedAgeRanges: Attribute[] = [];

    constructor(private lookupService: LookupService, private session: SessionService,
                private profileService: ProfileService) {
    }

    public initializePageOne(): Observable<Category[]> {
        if (!this.pageOneInitialized) {
            this.group = Group.overload_Constructor_CreateGroup(this.session.getContactId());
            return this.lookupService.getCategories()
            .do((cats: Category[]) => {
                this.categories = cats;
                this.pageOneInitialized = true;
            });
        } else {
            return Observable.of(this.categories);
        }
    }

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

    public validateCategories(): boolean {
        this.selectedCategories = this.categories.filter((category) => {
            return category.selected === true;
        });

        return (this.selectedCategories.length > 0 && this.selectedCategories.length < 3);
    }

    public addSelectedCategoriesToGroupModel(): void {
        let attributes: Attribute[] = [];
        this.selectedCategories.forEach((cat) => {
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
        let pin = new Pin(this.profileData.nickName, this.profileData.lastName, this.profileData.emailAddress, this.profileData.contactId,
                       this.profileData.participantId,
                       this.group.address, 2, _.cloneDeep(this.group), null, pinType.SMALL_GROUP, 0, this.profileData.householdId);

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
        let leaders: Participant[] = [];
        leaders.push(new Participant(null, null, null, null, null, null, null, true, this.profileData.lastName, this.profileData.nickName, null, null));
        return leaders;
    }

    /* 
    * This will clear meeting day, meeting time, and meeting frequency
    * this is called when meeting time type is flexible
    */
    public clearMeetingTimeData(): void {
        this.group.meetingDayId = null;
        this.group.meetingFrequencyId = null;
        this.group.meetingTime = null;
        this.group.meetingDay = null;
        this.group.meetingFrequency = null;
    }

    private createCategoryDetailAttribute(category: Category): Attribute {
        let attribute = new Attribute(0, category.categoryDetail, category.desc, category.name,
                            category.categoryId, null, 0, attributeTypes.GroupCategoryAttributeTypeId,
                            null, null);

        if (category.attribute != null) {
            attribute.startDate = category.attribute.startDate;
            attribute.endDate  = category.attribute.endDate;
        }

        return attribute;
    }

}

