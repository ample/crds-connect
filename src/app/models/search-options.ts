import { GeoCoordinates } from './geo-coordinates';

export class SearchOptions {

  search: string;
  filter: string;

  constructor(search: string, filter: string) {
    this.search = search;
    this.filter = filter;
  }

}
