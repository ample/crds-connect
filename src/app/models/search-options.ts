import { GeoCoordinates } from './geo-coordinates';

export class SearchOptions {
  coords: GeoCoordinates;
  search: string;
  filter: string;

  constructor(search: string, lat: number, lng: number, filter: string) {
    this.coords = new GeoCoordinates(lat, lng);
    this.search = search;
    this.filter = filter;
  }
}
