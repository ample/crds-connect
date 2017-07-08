export class PinSearchRequestParams {

  userLocationSearchString: string;
  userKeywordSearchString: string;
  userFilterString: string;
  isLocationSearch: boolean;

  constructor(isLocationSearch: boolean
            , userLocationSearchString: string
            , userKeywordSearchString: string
            , userFilterString: string) {
    this.isLocationSearch = isLocationSearch;
    this.userLocationSearchString = userLocationSearchString;
    this.userKeywordSearchString = userKeywordSearchString;
    this.userFilterString = userFilterString;
  }

}
