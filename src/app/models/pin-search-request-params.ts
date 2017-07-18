export class PinSearchRequestParams {
  userLocationSearchString: string;
  userKeywordSearchString: string;
  userFilterString: string;

  constructor(userLocationSearchString: string
            , userKeywordSearchString: string
            , userFilterString: string) {
    this.userLocationSearchString = userLocationSearchString;
    this.userKeywordSearchString = userKeywordSearchString;
    this.userFilterString = userFilterString;
  }
}
