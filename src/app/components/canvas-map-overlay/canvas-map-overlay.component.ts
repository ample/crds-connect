import { Component, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { GoogleMapService } from '../../services/google-map.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'canvas-map-overlay',
  templateUrl: 'canvas-map-overlay.component.html',
  styleUrls: ['canvas-map-overlay.component.css']
})
export class CanvasMapOverlayComponent implements OnInit {

  public canvasWidth: number = window.innerWidth;;
  public canvasHeight: number = window.innerHeight;;

  @ViewChild('myCanvas') canvasRef: ElementRef;

  constructor(private mapHlpr: GoogleMapService,
              private router: Router,
              private state: StateService) {

    mapHlpr.dataForDrawingEmitter.subscribe(testData => {
      console.log('CANVAS GOT TEST DATA: ');
      console.log(testData);

      let ctx: CanvasRenderingContext2D =
          this.canvasRef.nativeElement.getContext('2d');

      var geoBounds = testData.geoBounds;
      let canvBounds = this.canvasRef.nativeElement.getBoundingClientRect();
      var cWidth = canvBounds.width;
      var cHeight = canvBounds.height;
      var tenthHeight = cHeight/10;
      var tenthWidth = cWidth/10;

      console.log('Canvas width: ' + canvBounds.width);
      console.log('Canvas height: ' + canvBounds.height);

      //Draw grid lines
      for ( var j=1; j<10; j++ ) {
        ctx.beginPath();
        ctx.moveTo(tenthWidth * j,canvBounds.top);
        ctx.lineTo(tenthWidth * j,canvBounds.bottom);
        ctx.fillStyle = 'grey';
        ctx.stroke();

        ctx.fillText(tenthWidth * j + ', ' + canvBounds.top,
            tenthWidth * j,
            canvBounds.top + 20);

        ctx.fillText(tenthWidth * j + ', ' + canvBounds.bottom,
            tenthWidth * j,
            canvBounds.bottom - 20);
      }

      //draw circle on corners of map
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, 2 * Math.PI);
      ctx.fillStyle = 'Red';
      ctx.stroke();
      //draw circle on corner of map


      //draw a circle on the marker
      for (var i=0; i< testData.markers.length; i++){
        var marker = testData.markers[i];

        ctx.beginPath();
        ctx.arc(marker.markerGeoOffsetLatPercentage * cWidth, marker.markerGeoOffsetLngPercentage * cHeight, 50, 0, 2*Math.PI);
        ctx.fillStyle = 'Blue';
        ctx.stroke();

        ctx.font = "12px Arial";
        ctx.fillText(marker.markerLabel + ': ' + (marker.markerGeoOffsetLatPercentage * cWidth).toPrecision(5) + ' ' + (marker.markerGeoOffsetLngPercentage * cHeight).toPrecision(5) + '% ' + marker.markerGeoOffsetLatPercentage,
            marker.markerGeoOffsetLatPercentage * cWidth,
            marker.markerGeoOffsetLngPercentage * cHeight);
      }

    });

  }

  ngOnInit() {}

  // public resizeCanvas (cHeight: number, cWidth: number) {
  //   console.log('Resizing overlay to height/width: ' + cHeight + ' ' + cWidth);
  //   this.canvasWidth = cWidth;
  //   this.canvasHeight = cHeight;
  // }

  public myPinBtnClicked()  {
  }

}

