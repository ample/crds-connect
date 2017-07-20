import { Injectable} from '@angular/core';

import { AgeGroup } from '../models/age-group';
import { Category } from '../models/category';
import { GroupType } from '../models/group-type';

import { awsFieldNames } from '../shared/constants';

@Injectable()
export class FilterService {

  public filterStringKidsWelcome: string = null;
  public filterStringAgeGroups: string = null;
  public filterStringGroupTypes: string = null;
  public filterStringGroupLocation: string = null;
  public filterStringCategories: string = null;

  constructor() {}

  public buildFilters(): string {
    let filterString: string;

    filterString = (this.filterStringKidsWelcome != null) ? this.filterStringKidsWelcome : '';
    filterString = (this.filterStringAgeGroups != null) ? filterString + this.filterStringAgeGroups : filterString;
    filterString = (this.filterStringGroupTypes != null) ? filterString + this.filterStringGroupTypes : filterString;
    filterString = (this.filterStringGroupLocation != null) ? filterString + this.filterStringGroupLocation : filterString;
    filterString = (this.filterStringCategories != null) ? filterString + this.filterStringCategories : filterString;

    return filterString;
  }

  public resetFilterString(): void {
    this.filterStringAgeGroups = null;
    this.filterStringKidsWelcome = null;
    this.filterStringGroupTypes = null;
    this.filterStringGroupLocation = null;
    this.filterStringCategories = null;
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

// TODO fix this!
  public setFilterStringCategories(categories: Category[]): void {
// TODO fix this!    

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

}
