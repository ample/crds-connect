export class SearchOptions {

  keywordSearch: string;
  filter: string;
  locationSearch: string;

  constructor(keywordSearch: string, filter: string, locationSearch: string) {
    this.keywordSearch = keywordSearch;
    this.filter = filter;
    this.locationSearch = locationSearch;
  }
}
