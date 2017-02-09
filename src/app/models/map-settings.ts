export class MapSettings {

    lat: number; //map centered on this latitutde
    lng: number; //map centered on this longitude
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

