import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

  public lat: number = 39.1031;
  public lng: number = -84.5120;
  public zoom: number = 15;
  public disableDefaultUI = false;
  public zoomControl = true;


  constructor(
  ) { }

  public ngOnInit(): void {

  }


}
