import { Component, HostListener, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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

    mapHlpr.mapClearEmitter.subscribe(() => {
      //console.log('CLEAR MAP EVENT RECEIVED');

      let ctx: CanvasRenderingContext2D =
          this.canvasRef.nativeElement.getContext('2d');

      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    });

    mapHlpr.dataForDrawingEmitter.subscribe(drawingData => {

      let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      let geoBounds = drawingData.geoBounds;
      let canvBounds = this.canvasRef.nativeElement.getBoundingClientRect();
      let cWidth = canvBounds.width;
      let cHeight = canvBounds.height;

      this.drawGridLines(ctx, canvBounds, cWidth, cHeight);

      //this.drawTestingMarkers(ctx, drawingData, cWidth, cHeight);

      this.drawMarkerLabels(ctx, drawingData, cWidth, cHeight);

    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log('WINDOW RESIZE EVENT');
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
  }

  ngOnInit() {}

  // public resizeCanvas (cHeight: number, cWidth: number) {
  //   console.log('Resizing overlay to height/width: ' + cHeight + ' ' + cWidth);
  //   this.canvasWidth = cWidth;
  //   this.canvasHeight = cHeight;
  // }

  public myPinBtnClicked(ctx: any)  {
  }

  public drawMarkerLabels(ctx: any, drawingData: any, cWidth: any, cHeight: any): void {
    for (var i=0; i< drawingData.markers.length; i++){
      let marker: any = drawingData.markers[i];
      this.drawIndividualMarkerLabel(ctx, marker, cWidth, cHeight);
    }
  }

  public drawIndividualMarkerLabel(ctx: any, marker: any, cWidth:any, cHeight: any){

    let textX = (marker.markerGeoOffsetLatPercentage * cWidth) + 10;
    let textY = (marker.markerGeoOffsetLngPercentage * cHeight) - 40;
    let markerLabelProps = this.getMarkerLabelProps(marker);
    ctx.fillStyle = this.getLabelColor(markerLabelProps);
    ctx.font = "12px Arial";

    let nameLabel: string = markerLabelProps.firstName + ' ' + markerLabelProps.lastInitial;
    ctx.fillText(nameLabel, textX, textY);

    //console.log("Drawing marker - Host label: " + markerLabelProps.hostOrMe);
    //console.log(!!markerLabelProps.hostOrMe);
    if( !!markerLabelProps.hostOrMe ){
      //console.log('Drawing host label');
      ctx.fillText(markerLabelProps.hostOrMe, textX, textY + 15);
    }
  }

  public getLabelColor(markerLabelProps) {

    let labelColor = undefined;

    switch(markerLabelProps.hostOrMe) {
      case 'ME':
        labelColor = 'Yellow';
        break;
      case 'HOST':
        labelColor = 'Blue';
        break;
      default:
        labelColor = 'Teal';
    }

    return labelColor;
  }

  public getMarkerLabelProps(marker:any): any{
    console.log(marker);
    let labelStringComponents = marker.markerLabel.split('|');

    let labelProps = {
      firstName: labelStringComponents[0],
      lastInitial: labelStringComponents[1],
      hostOrMe: labelStringComponents[3] ? labelStringComponents[3] : labelStringComponents[2] || ''
    };

    console.log(labelProps);
    return labelProps;

  };

  public selectMarkerLabelColor(marker: any){

  }

  public drawTestingMarkers(ctx: any, drawingData: any, cWidth: any, cHeight: any): void {
    for (var i=0; i< drawingData.markers.length; i++){
      var marker = drawingData.markers[i];

      ctx.beginPath();
      ctx.arc(
          marker.markerGeoOffsetLatPercentage * cWidth,
          marker.markerGeoOffsetLngPercentage * cHeight, 50, 0, 2*Math.PI
      );
      ctx.fillStyle = 'Blue';
      ctx.stroke();

      ctx.font = "12px Arial";
      ctx.fillText(marker.markerLabel + ': ' + (marker.markerGeoOffsetLatPercentage * cWidth).toPrecision(5) + ' ' + (marker.markerGeoOffsetLngPercentage * cHeight).toPrecision(5) + '% ' + marker.markerGeoOffsetLatPercentage,
          marker.markerGeoOffsetLatPercentage * cWidth,
          marker.markerGeoOffsetLngPercentage * cHeight);
    }
  }

  public drawGridLines(ctx: any, canvBounds: any, cWidth: any, cHeight: any): void {

    var tenthWidth = cWidth/10;

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
  }

}
