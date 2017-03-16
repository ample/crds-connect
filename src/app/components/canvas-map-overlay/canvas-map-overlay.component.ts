import { Component, OnInit, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../../services/state.service';

@Component({
  selector: 'canvas-map-overlay',
  templateUrl: 'canvas-map-overlay.component.html',
  styleUrls: ['canvas-map-overlay.component.css']
})
export class CanvasMapOverlayComponent implements OnInit{

  @ViewChild('myCanvas') canvasRef: ElementRef;

  constructor(private router: Router,
              private state: StateService) { }

  ngOnInit() {
    console.log('Painting canvas!');
    let ctx: CanvasRenderingContext2D =
        this.canvasRef.nativeElement.getContext('2d');

    ctx.rect(20,20,150,100);
    ctx.stroke();
    ctx.fillStyle = '#DD0031';
    ctx.fill();
  }

  public myPinBtnClicked()  {
  }

}

