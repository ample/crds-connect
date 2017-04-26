import { Angulartics2 } from 'angulartics2';

import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../../../../services/state.service';
import { PinService } from '../../../../services/pin.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';

@Component({
  templateUrl: 'remove-person-pin.component.html'
})

export class RemovePersonPinComponent implements OnInit {

  constructor(private router: Router,
    private state: StateService,
    private content: ContentService,
    private pinService: PinService, ) { }

  public ngOnInit(): void {
  }

  public removePersonPin() {
    this.router.navigateByUrl('/');
  }

  public cancel() {

  }







}
