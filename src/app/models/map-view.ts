export class MapView {

  value: String;
  lat: number;
  lng: number;
  zoom: number;

  constructor(value: string, lat: number, lng: number, zoom: number) {
    this.value = value;
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
  }

}
