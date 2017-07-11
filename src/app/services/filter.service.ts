import { Injectable} from '@angular/core';
import { awsFieldNames } from '../shared/constants';

import { AgeGroup } from '../models/age-group';

@Injectable()
export class FilterService {

  public filterStringKidsWelcome: string = null;
  public filterStringAgeGroups: string = null;

  constructor() {}

  public buildFilters(): string {
    // TODO Add each new filter
    let filterString: string;
    filterString = (this.filterStringKidsWelcome != null) ? this.filterStringKidsWelcome : '';
    filterString = (this.filterStringAgeGroups != null) ? filterString + this.filterStringAgeGroups : filterString;
    return filterString;
  }

  public resetFilterString(): void {
    // TODO Add each new filters
    this.filterStringAgeGroups = null;
    this.filterStringKidsWelcome = null;
  }

  public setFilterStringKidsWelcome(welcomeFlag: number, haveKidsWelcomeValue: boolean): void {
    this.filterStringKidsWelcome = haveKidsWelcomeValue ?
                                   `(or ${awsFieldNames.GROUP_KIDS_WELCOME}: ${welcomeFlag})` :
                                  null;
  }

  public setFilterStringAgeGroups(ageGroups: AgeGroup[]): void {
    let addFilterString: string = '';
    addFilterString = ' (or';
    for (let age of ageGroups) {
      if (age.selected) {
        // need single quotes around each value since it is a string in aws
        addFilterString += ` ${awsFieldNames.GROUP_AGE_RANGE}: \'${age.attribute.name}\' `;
      }
    }
    addFilterString += ' )';

    this.filterStringAgeGroups =  addFilterString;
  }

}
