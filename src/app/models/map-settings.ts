export class MapSettings {
  lat: number; // map centers on this latitutde
  lng: number; // map centers on this longitude
  zoom: number;
  disableDefaultUi: boolean;
  zoomControl: boolean;

  constructor(lat: number, lng: number, zoom: number, disableDefaultUi: boolean, zoomControl: boolean) {
    this.lat = lat;
    this.lng = lng;
    this.zoom = zoom;
    this.disableDefaultUi = disableDefaultUi;
    this.zoomControl = zoomControl;
  }
}
