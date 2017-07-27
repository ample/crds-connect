import { Injectable} from '@angular/core';

import { AgeGroup } from '../models/age-group';
import { Category } from '../models/category';
import { GroupType } from '../models/group-type';
import { SimpleSelectable} from '../models/simple-selectable';

import { awsFieldNames, DaysOfWeek, daysOfWeek } from '../shared/constants';

@Injectable()
export class FilterService {

  public filterStringKidsWelcome: string = null;
  public filterStringAgeGroups: string = null;
  public filterStringGroupTypes: string = null;
  public filterStringGroupLocation: string = null;
  public filterStringCategories: string = null;
  public filterStringMeetingDays: string = null;

  constructor() {}

  public buildFilters(): string {
    let filterString: string;

    filterString = (this.filterStringKidsWelcome != null) ? this.filterStringKidsWelcome : '';
    filterString = (this.filterStringAgeGroups != null) ? filterString + this.filterStringAgeGroups : filterString;
    filterString = (this.filterStringGroupTypes != null) ? filterString + this.filterStringGroupTypes : filterString;
    filterString = (this.filterStringGroupLocation != null) ? filterString + this.filterStringGroupLocation : filterString;
    filterString = (this.filterStringCategories != null) ? filterString + this.filterStringCategories : filterString;
    filterString = (this.filterStringMeetingDays != null) ? filterString + this.filterStringMeetingDays : filterString;

    return filterString;
  }

  public resetFilterString(): void {
    this.filterStringAgeGroups = null;
    this.filterStringKidsWelcome = null;
    this.filterStringGroupTypes = null;
    this.filterStringGroupLocation = null;
    this.filterStringCategories = null;
    this.filterStringMeetingDays = null;
  }

  public setFilterStringKidsWelcome(welcomeFlag: number, haveKidsWelcomeValue: boolean): void {
    this.filterStringKidsWelcome = haveKidsWelcomeValue ?
                                   `(or ${awsFieldNames.GROUP_KIDS_WELCOME}: ${welcomeFlag})` :
                                  null;
  }

  public setFilterStringIsVirtualGroup(isVirtualFlag: number, haveIsVirtualGroupValue: boolean): void {
    this.filterStringGroupLocation = haveIsVirtualGroupValue ?
        `(or ${awsFieldNames.GROUP_VIRTUAL}: ${isVirtualFlag})` :
        null;
  }

  public setFilterStringAgeGroups(ageGroups: AgeGroup[]): void {
    let addFilterString: string = ' (or';
    for (let age of ageGroups) {
      if (age.selected) {
        // need single quotes around each value since it is a string in aws
        addFilterString += ` ${awsFieldNames.GROUP_AGE_RANGE}: \'${age.attribute.name}\' `;
      }
    }
    addFilterString += ' )';

    this.filterStringAgeGroups = addFilterString;
  }


  public setFilterStringCategories(categories: Category[]): void {
    let addFilterString: string = ' (or';
    for (let cat of categories) {
      if (cat.selected) {
        // need single quotes around each value since it is a string in aws
        addFilterString += ` (prefix field=\'${awsFieldNames.GROUP_CATEGORY}\' \'${cat.name}\')  `;
      }
    }
    addFilterString += ' )';

    this.filterStringCategories = addFilterString;
  }

  public setFilterStringGroupTypes (groupTypes: GroupType[]): void {
    let addFilterString: string = ' (or';
    for (let groupType of groupTypes) {
      if (groupType.selected) {
        // need single quotes around each value since it is a string in aws
        addFilterString += ` ${awsFieldNames.GROUP_TYPE}: \'${groupType.attribute.name}\' `;
      }
    }
    addFilterString += ' )';

    this.filterStringGroupTypes = addFilterString;
  }

    public setFilterStringMeetingDays (daysOfWeek: SimpleSelectable[]): void {

      let addFilterString: string = ' (or';
      for (let day of daysOfWeek) {
        if (day.isSelected) {
          // need single quotes around each value since it is a string in aws
          addFilterString += ` ${awsFieldNames.MEETING_DAY}: \'${day.value}\' `;
        }
      }
      addFilterString += ' )';

      this.filterStringMeetingDays = addFilterString;
    }

  public getDayNamesArrayFromClass(daysOfWeekClass: DaysOfWeek): string[]{

    let daysOfWeek: string[] = [];

    for (var property in daysOfWeekClass) {
      if (daysOfWeekClass.hasOwnProperty(property)) {
        daysOfWeek.push(daysOfWeekClass[property.toString()]);
      }
    }

    return daysOfWeek;
  }

  public buildSelectableObjectsFromStringArray(valueStrings: string[]): SimpleSelectable[] {
    let selectables: SimpleSelectable[] = valueStrings.map(vs => new SimpleSelectable(vs));
    return selectables;
  }

  public getSelectableDaysOfTheWeek(daysOfWeekClass: DaysOfWeek): SimpleSelectable[] {
    let dayOfWeekNames: string[] = this.getDayNamesArrayFromClass(daysOfWeek);
    let selectableDaysOfTheWeek: SimpleSelectable[] = this.buildSelectableObjectsFromStringArray(dayOfWeekNames);
    return selectableDaysOfTheWeek;
  }

}
