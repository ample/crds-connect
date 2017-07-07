import { Injectable} from '@angular/core';
import { awsFieldNames } from '../shared/constants';

@Injectable()
export class FilterService {

  public filterStringKidsWelcome: string = null;
  public filterStringAgeGroups: string = null;

  constructor() {}

  public buildFilters(): string {
    // TODO return all filters concatenated
    // TODO check for null before adding
    let filterString: string;
    filterString = (this.filterStringKidsWelcome != null) ? this.filterStringKidsWelcome : '';
    filterString = (this.filterStringAgeGroups != null) ? filterString + this.filterStringAgeGroups : filterString;
    return filterString;
  }

}
