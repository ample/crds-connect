import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Address, Attribute, AttributeType, Group } from '../../models';
import { Category } from '../../models/category';
import { LookupService } from '../../services/lookup.service';
import { SessionService } from '../../services/session.service';
import { attributeTypes } from '../../shared/constants';

@Injectable()
export class CreateGroupService {
    private pageOneInitialized: boolean = false;
    public meetingTimeType: string = 'specific';
    public meetingIsInPerson: boolean = true;

    public categories: Category[] = [];
    private selectedCategories: Category[] = [];
    public group: Group;

    public selectedGroupGenderMix: Attribute = Attribute.constructor_create_group();
    public selectedAgeRanges: Attribute[] = [];

    constructor(private lookupService: LookupService, private session: SessionService) {
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

    /* 
    * This will clear meeting day, meeting time, and meeting frequency
    * this is called when meeting time type is flexible
    */
    public clearMeetingTimeData() {
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

