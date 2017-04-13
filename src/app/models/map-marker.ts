
export class MapMarker {
  markerLabel: string;
  markerLat: number;
  markerLng: number;
  markerOffsetX: number;
  markerOffsetY: number;
  markerGeoOffsetLatPercentage: number;
  markerGeoOffsetLngPercentage: number;
  icon: string;

    // constructor( markerLabel: string, markerLat: number, markerLng: number, markerOffsetX: number, markerOffsetY: number,
    //              markerGeoOffsetLatPercentage: number, markerGeoOffsetLngPercentage: number, icon: string) {
    //   this.markerLabel = markerLabel;
    //   this.markerLat = markerLat;
    //   this.markerLng = markerLng;
    //   this.markerOffsetX = markerOffsetX;
    //   this.markerOffsetY = markerOffsetY;
    //   this.markerGeoOffsetLatPercentage = markerGeoOffsetLatPercentage;
    //   this.markerGeoOffsetLngPercentage =  markerGeoOffsetLngPercentage;
    //   this.icon = icon;
    // }

  constructor( marker: any, geoBounds: any, delta: Function) {
    this.markerLabel = marker.title;
    this.markerLat = marker.position.lat().valueOf();
    this.markerLng = marker.position.lng().valueOf();
    this.markerOffsetX = delta(this.markerLng, geoBounds.right);
    this.markerOffsetY = delta(this.markerLat, geoBounds.bottom);
    this.markerGeoOffsetLatPercentage = this.markerOffsetX / geoBounds.width;
    this.markerGeoOffsetLngPercentage =  this.markerOffsetY / geoBounds.height;
    this.icon = marker.icon;
  }
}
