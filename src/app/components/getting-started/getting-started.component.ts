import { Angulartics2 } from 'angulartics2';
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StateService } from '../../services/state.service';
import { AppSettingsService } from '../../services/app-settings.service';


@Component({
  templateUrl: 'getting-started.component.html'
})
export class GettingStartedComponent implements OnInit {

  constructor(private router: Router,
             private state: StateService,
             private appSettings: AppSettingsService) {}

  ngOnInit() {
    this.state.setPageHeader('Getting Started', '/');
    this.state.setLoading(false);
    return true;
  }
}
