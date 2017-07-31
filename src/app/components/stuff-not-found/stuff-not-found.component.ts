import { StateService } from '../../services/state.service';
import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';

@Component({
  selector: 'stuff-not-found',
  templateUrl: 'stuff-not-found.html'
})
export class StuffNotFoundComponent implements OnInit {
  constructor(private state: StateService, private appSettings: AppSettingsService) { }

  public ngOnInit() {
    this.state.setPageHeader(this.appSettings.myStuffName, '/');
    this.state.setLoading(false);
  }
}
