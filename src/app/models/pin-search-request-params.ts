export class PinSearchRequestParams {

  userSearchString: string;
  isLocationSearch: boolean;

  constructor(isLocationSearch: boolean, userSearchString: string) {
    this.isLocationSearch = isLocationSearch;
    this.userSearchString = userSearchString;
  }

}