import { Injectable} from '@angular/core';

import { AgeGroup, Category, GroupType, SimpleSelectable, pinType } from '../models';

import { awsFieldNames, DaysOfWeek, daysOfWeek, groupMeetingTimeRanges,
         awsMeetingTimeSearchStrings } from '../shared/constants';

@Injectable()
export class FilterService {

  public filterStringKidsWelcome: string = null;
  public filterStringAgeGroups: string = null;
  public filterStringGroupTypes: string = null;
  public filterStringGroupLocation: string = null;
  public filterStringCategories: string = null;
  public filterStringMeetingDays: string = null;
  public filterStringMeetingTimes: string = null;
  public filterStringMeetingFrequencies: string = null;
  public filterStringHostOnly: string = null;

  constructor() {}

  public buildFilters(): string {
    let filterString: string;

    filterString = (this.filterStringKidsWelcome != null) ? this.filterStringKidsWelcome : '';
    filterString = (this.filterStringAgeGroups != null) ? filterString + this.filterStringAgeGroups : filterString;
    filterString = (this.filterStringGroupTypes != null) ? filterString + this.filterStringGroupTypes : filterString;
    filterString = (this.filterStringGroupLocation != null) ? filterString + this.filterStringGroupLocation : filterString;
    filterString = (this.filterStringCategories != null) ? filterString + this.filterStringCategories : filterString;
    filterString = (this.filterStringMeetingDays != null) ? filterString + this.filterStringMeetingDays : filterString;
    filterString = (this.filterStringMeetingTimes != null) ? filterString + this.filterStringMeetingTimes : filterString;
    filterString = (this.filterStringMeetingFrequencies != null) ? filterString + this.filterStringMeetingFrequencies : filterString;
    filterString = (this.filterStringHostOnly != null) ? filterString + this.filterStringHostOnly : filterString;

    return filterString;
  }

  public resetFilterString(): void {
    this.filterStringAgeGroups = null;
    this.filterStringKidsWelcome = null;
    this.filterStringGroupTypes = null;
    this.filterStringGroupLocation = null;
    this.filterStringCategories = null;
    this.filterStringMeetingDays = null;
    this.filterStringMeetingTimes = null;
    this.filterStringMeetingFrequencies = null;
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

    if ( ageGroups.filter(x => x.selected === true).length === 0) {
      this.filterStringAgeGroups = null;
      return;
    }

    let addFilterString: string = ' (or';
    for (let age of ageGroups) {
      if (age.selected) {
        // need single quotes around each value since it is a string in aws
        addFilterString += ` ${awsFieldNames.GROUP_AGE_RANGE}: \'${age.attribute.name}\'`;
      }
    }
    addFilterString += ' )';

    this.filterStringAgeGroups = addFilterString;
  }

  public setFilterStringHostOnly(isFilterOn: boolean): void {
    if (isFilterOn) {
    this.filterStringHostOnly = ` (or ${awsFieldNames.PIN_TYPE}: ${pinType.GATHERING} ${awsFieldNames.PIN_TYPE}: ${pinType.SITE})`;
    } else {
      this.filterStringHostOnly = null;
    }
  }

  public getIsHostOnlyFiltered(): boolean {
    return this.filterStringHostOnly != null;
  }

  public setFilterStringCategories(categories: Category[]): void {
    if ( categories.filter(x => x.selected === true).length === 0) {
      this.filterStringCategories = null;
      return;
    }

    let addFilterString: string = ' (or';
    for (let cat of categories) {
      if (cat.selected) {
        // need single quotes around each value since it is a string in aws
        addFilterString += ` (prefix field=\'${awsFieldNames.GROUP_CATEGORY}\' \'${cat.name}\') `;
      }
    }
    addFilterString += ' )';

    this.filterStringCategories = addFilterString;
  }

  public setFilterStringGroupTypes (groupTypes: GroupType[]): void {

    if ( groupTypes.filter(x => x.selected === true).length === 0) {
      this.filterStringGroupTypes = null;
      return;
    }

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

    if ( daysOfWeek.filter(x => x.isSelected === true).length === 0) {
      this.filterStringMeetingDays = null;
      return;
    }

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


  public getAwsTimeRangeFilterString(meetingTimeRange: string): string {
    let filter: string = undefined;

    switch (meetingTimeRange) {
      case groupMeetingTimeRanges.MORNINGS:
        filter = awsMeetingTimeSearchStrings.MORNINGS;
        break;
      case groupMeetingTimeRanges.AFTERNOONS:
        filter = awsMeetingTimeSearchStrings.AFTERNOONS;
        break;
      default:
        filter = awsMeetingTimeSearchStrings.EVENINGS;
    }

    return filter;
  }

  public getTimeOfDayFromAwsTimeString(awsTimeString: string): string {
    let filter: string = undefined;
    switch (awsTimeString) {
      case awsMeetingTimeSearchStrings.MORNINGS:
        filter = groupMeetingTimeRanges.MORNINGS;
        break;
      case awsMeetingTimeSearchStrings.AFTERNOONS:
        filter = groupMeetingTimeRanges.AFTERNOONS;
        break;
      case awsMeetingTimeSearchStrings.EVENINGS:
        filter = groupMeetingTimeRanges.EVENINGS;
        break;
      default:
        console.log(`Error: couldn't get awsMeetingTimeSearchString from ${awsTimeString}`);
    }
    return filter;
  }

  public setFilterStringMeetingTimes (meetingTimeRanges: SimpleSelectable[]): void {

    if ( meetingTimeRanges.filter(x => x.isSelected === true).length === 0) {
        this.filterStringMeetingTimes = null;
      return;
    }

    let addFilterString: string = ' (or';

    for (let range of meetingTimeRanges) {
      if (range.isSelected) {
        addFilterString += ` ${awsFieldNames.MEETING_TIME}: ${this.getAwsTimeRangeFilterString(range.value)} `;
      }
    }

    addFilterString += ' )';

    this.filterStringMeetingTimes = addFilterString;
  }

  public setFilterStringMeetingFrequencies (meetingFrequencies: SimpleSelectable[]): void {

    if ( meetingFrequencies.filter(x => x.isSelected === true).length === 0) {
        this.filterStringMeetingFrequencies = null;
      return;
    }

    let addFilterString: string = ' (or';

    for (let freq of meetingFrequencies) {
      if (freq.isSelected) {
      // need single quotes around each value since it is a string in aws
      addFilterString += ` ${awsFieldNames.MEETING_FREQUENCY}: '${freq.value}' `;
      }
    }

    addFilterString += ' )';

    this.filterStringMeetingFrequencies = addFilterString;
  }

  /*
   * Given an object with all own properties of type string,
   * return the values of all properties as a string array
   * Used on properties of classes in constants.ts
   */
  public buildAnArrayOfPropertyValuesFromObject(obj: Object): string[]{

    let objectPropValues: string[] = [];

    for (var property in obj) {
      if (obj.hasOwnProperty(property)) {
        objectPropValues.push(obj[property.toString()]);
      }
    }

    return objectPropValues;
  }

  public buildSelectableObjectsFromStringArray(valueStrings: string[]): SimpleSelectable[] {
    let selectables: SimpleSelectable[] = valueStrings.map(vs => new SimpleSelectable(vs));
    return selectables;
  }

  /*
   * Given an array of strings, such as ['Monday', 'Tuesday', 'Wednesday'],
   * build an array of selectables, e.g. [{value: 'Monday', isSelected: false}, {value: 'Tuesday', isSelected: false}..]
   * These can be used on the UI to display and select / unselect values
   */
  public buildArrayOfSelectables(obj: Object): SimpleSelectable[] {
    let objPropertyNames: string[] = this.buildAnArrayOfPropertyValuesFromObject(obj);
    let selectableObjArray: SimpleSelectable[] = this.buildSelectableObjectsFromStringArray(objPropertyNames);
    return selectableObjArray;
  }

  /*
   * Gets selected age groups from filter string saved in the service.
   */
  public getSelectedAgeGroups(): string[] {
    let ageGroups: string[] = undefined;
    if (this.filterStringAgeGroups) {
      ageGroups = this.filterStringAgeGroups.replace(/(\(or )|: |\(prefix field=|'| \)/g, '').split('groupagerange').slice(1);
      ageGroups = ageGroups.map(age => age.trim());
    }
    return ageGroups;
  }

  public getSelectedCategories(): string[] {
    let selectedCategories: string[] = undefined;
    if (this.filterStringCategories) {
      selectedCategories = this.filterStringCategories.replace(/(\(or )|: |\(prefix field=|'|\)/g, '').split('groupcategory').slice(1);
      selectedCategories = selectedCategories.map(group => group.trim());
    }
    return selectedCategories;
  }

  public getSelectedGenderMixes(): string {
    let selectedGenderMixes: string = undefined;
    if (this.filterStringGroupTypes) {
      selectedGenderMixes = this.filterStringGroupTypes.replace(/\(or|'|:|grouptype|[)]/g, '').trim();
    }
    return selectedGenderMixes;
  }

  /*
   * Gets selected kids welcome filter if the kidsWelcome filter string is set
   * returns undefined if there is no filter set.
   */
  public getSelectedKidsWelcomeFlag(): string {
    const selectedKidsWelcomeFlag = (this.filterStringKidsWelcome) ? this.filterStringKidsWelcome.replace(/\D/g, '') : undefined;
    return selectedKidsWelcomeFlag;
  }

  /*
   * Gets selected meeting days from filter string
   * returns undefined if no filter string
   */
  public getSelectedMeetingDays(): string[] {
    let selectedDays: string[] = undefined;
    if (this.filterStringMeetingDays) {
      selectedDays = this.filterStringMeetingDays.replace(/(\(or)|( )|'|\)/g, '').split('groupmeetingday:').slice(1);
    }
    return selectedDays;
  };

  /*
   * Gets selected meeting frequency filters from filter string
   * returns undefined if there is no filter string set.
   */
  public getSelectedMeetingFrequencies(): string[] {
    let selectedFrequencies: string[] = undefined;
    if (this.filterStringMeetingFrequencies) {
      selectedFrequencies = this.filterStringMeetingFrequencies.replace(/(\(or )|'|\)/g, '').split('groupmeetingfrequency:').slice(1);
      selectedFrequencies = selectedFrequencies.map(element => element.trim());
    }
    return selectedFrequencies;
  }

  /*
   * Gets selected time of day filters from the filter string
   * returns undefined if no filter string is set.
   */
  public getSelectedMeetingTimes(): string[] {
    let selectedMeetingTimes: string[] = undefined;
    if (this.filterStringMeetingTimes) {
      selectedMeetingTimes = this.filterStringMeetingTimes.replace(/(\(or )|: |  \)|/g, '').split('groupmeetingtime').slice(1);
      selectedMeetingTimes = selectedMeetingTimes.map(time => this.getTimeOfDayFromAwsTimeString(time.trim()));
    }
    return selectedMeetingTimes;
  }

  /*
   * Gets selected kids welcome filter if the kidsWelcome filter string is set
   * returns undefined if there is no filter set.
   */
  public getSelectedGroupLocation(): string {
    const selectedGroupLocation = (this.filterStringGroupLocation) ? this.filterStringGroupLocation.replace(/\D/g, '') : undefined;
    return selectedGroupLocation;
  }
}

