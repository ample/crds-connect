export class PinSearchRequestParams {

  userSearchString: string;
  userFilterString: string;
  isLocationSearch: boolean;

  constructor(isLocationSearch: boolean, userSearchString: string, userFilterString: string) {
    this.isLocationSearch = isLocationSearch;
    this.userSearchString = userSearchString;
    this.userFilterString = userFilterString;
  }

}
