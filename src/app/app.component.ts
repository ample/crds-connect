import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Angulartics2GoogleTagManager } from 'angulartics2';

import { ContentService } from './services/content.service';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="container" [ngClass]="{'loading': state.is_loading}">
      <app-preloader></app-preloader>
      <div class="outlet-wrapper">
        <router-outlet></router-outlet>
      </div>
    </div>`,
  styleUrls: ['../styles/application.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
  action: string;
  type: string;
  params: any;
  iFrameResizerCW: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    private state: StateService,
    private content: ContentService) {

    if ( this.iFrameResizerCW === undefined ) {
      this.iFrameResizerCW = require('iframe-resizer/js/iframeResizer.contentWindow.js');
    }
  }

  ngOnInit() {
    this.content.loadData();
  }

}
