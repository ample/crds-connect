import { Component, ViewEncapsulation, OnInit, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Angulartics2GoogleTagManager } from 'angulartics2';
import { ToastModule, ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  template: `
    <div [ngClass]="{'loading': state.is_loading}">
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
    private content: ContentService,
    public toastr: ToastsManager,
    vRef: ViewContainerRef) {

    if ( this.iFrameResizerCW === undefined ) {
      this.iFrameResizerCW = require('iframe-resizer/js/iframeResizer.contentWindow.js');
      this.toastr.setRootViewContainerRef(vRef);
    }
  }

  ngOnInit() {
  }

}
