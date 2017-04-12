
export class MapMarker {
  markerLabel: string;
  markerLat: number;
  markerLng: number;
  markerOffsetX: number;
  markerOffsetY: number;
  markerGeoOffsetLatPercentage: number;
  markerGeoOffsetLngPercentage: number;
  icon: string;

    constructor( markerLabel: string, markerLat: number, markerLng: number, markerOffsetX: number, markerOffsetY: number,
                 markerGeoOffsetLatPercentage: number, markerGeoOffsetLngPercentage: number, icon: string) {
      this.markerLabel = markerLabel;
      this.markerLat = markerLat;
      this.markerLng = markerLng;
      this.markerOffsetX = markerOffsetX;
      this.markerOffsetY = markerOffsetY;
      this.markerGeoOffsetLatPercentage = markerGeoOffsetLatPercentage;
      this.markerGeoOffsetLngPercentage =  markerGeoOffsetLngPercentage;
      this.icon = icon;
    }
}
