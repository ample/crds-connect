import { Component, HostListener, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { GoogleMapService } from '../../services/google-map.service';
import { StateService } from '../../services/state.service';

import { PinLabelData, PinLabel } from '../../models/pin-label-data';
import { Pin, pinType } from '../../models/pin';

@Component({
  selector: 'canvas-map-overlay',
  templateUrl: 'canvas-map-overlay.component.html'
})
export class CanvasMapOverlayComponent implements OnInit {

  public canvasWidth: number = window.innerWidth;
  public canvasHeight: number = window.innerHeight - 110; // make sure it matches the style value

  @ViewChild('myCanvas') canvasRef: ElementRef;

  constructor(private mapHlpr: GoogleMapService,
              private router: Router,
              private state: StateService) {

    mapHlpr.mapClearEmitter.subscribe(() => {
      let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    });

    mapHlpr.dataForDrawingEmitter.subscribe(drawingData => {

      let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      let canvBounds = this.canvasRef.nativeElement.getBoundingClientRect();
      let cWidth = canvBounds.width;
      let cHeight = canvBounds.height;

      let geoBounds: any = drawingData.geoBounds;
      let isZoomedEnoughToDisplayPins = Math.abs(geoBounds.width) < 8.5 && Math.abs(geoBounds.height) < 1.8;

      if (isZoomedEnoughToDisplayPins) {
        this.drawMarkerLabels(ctx, drawingData, cWidth, cHeight);
      }

    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
  }

  ngOnInit() {}

  public drawMarkerLabels(ctx: any, drawingData: any, cWidth: any, cHeight: any): void {

    let isMapInitialized: boolean = cWidth !== 0 || cHeight !== 0;

    if( isMapInitialized ) {
      for (let i = 0; i < drawingData.markers.length; i++){
        let marker: any = drawingData.markers[i];
        this.drawIndividualMarkerLabel(ctx, marker, cWidth, cHeight);
      }
    }

  }

  public drawIndividualMarkerLabel(ctx: any, marker: any, cWidth: any, cHeight: any) {

    let labelData: PinLabelData = JSON.parse(marker.markerLabel);

    let isHostOrMe: boolean = labelData.isHost || labelData.isMe;

    let markerLabelProps = this.getMarkerLabelProps(labelData);

    let labelHeightAdjustment: number = this.mapHlpr.getLabelHeightAdjustment(cHeight, marker, isHostOrMe);

    let textX = (marker.markerGeoOffsetLatPercentage * cWidth) + 10;
    let textY = (marker.markerGeoOffsetLngPercentage * cHeight) - labelHeightAdjustment;


    // draw line 1
    ctx.fillStyle = this.getLabelColor(markerLabelProps);
    ctx.strokeStyle = '#ffffff';
    //ctx.lineWidth = 2.5;
    ctx.font = '12px Arial';

    ctx.strokeText(markerLabelProps.line1, textX, textY);
    //ctx.fillText(markerLabelProps.line1, textX, textY);
    ctx.fillText(markerLabelProps.line1 + ' ' + labelHeightAdjustment + ' ' + marker.markerGeoOffsetLngPercentage + '%', textX, textY);

    //TESTING CODE
    ctx.font = '40px Arial';
    ctx.fillText('Screen height: ' + cHeight, 50, 50);
    //TESTING CODE

    //draw line 2
    if( isHostOrMe ){
      ctx.font = '10px Arial';
      ctx.strokeText(markerLabelProps.line2, textX+6, textY + 12);
      ctx.fillText(markerLabelProps.line2, textX+6, textY + 12);
    }

  }

  public getLabelColor(markerLabelProps) {

    let labelColor = undefined;

    switch(markerLabelProps.hostOrMe) {
      case 'ME':
        labelColor = '#A47403';
        break;
      case 'HOST':
        labelColor = '#0196dc';
        break;
      default:
        if (markerLabelProps.lastInitial === '') {
          labelColor = '#c05c04';
        } else {
          labelColor = '#3b6f91';
        }
    }

    return labelColor;
  }

  public getMarkerLabelProps(labelData: PinLabelData): PinLabel {
    let label: PinLabel = new PinLabel(labelData);
    return label;
  };

}
