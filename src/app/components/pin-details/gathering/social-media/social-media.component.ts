import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'social-media',
  templateUrl: './social-media.component.html'
})
export class SocialMediaComponent  {

  constructor() { }

  public getURL(): string {
    return window.location.href;
  }
}
