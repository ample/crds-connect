export class SearchOptions {
  search: string;
  filter: string;
  location: string;

  constructor(search: string, filter: string, location: string) {
    this.search = search;
    this.filter = filter;
    this.location = location;
  }
}
