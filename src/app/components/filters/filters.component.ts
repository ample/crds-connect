import { Angulartics2 } from 'angulartics2';

import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
import { StateService } from '../../services/state.service';

import { Pin, pinType } from '../../models/pin';


@Component({
  selector: 'app-filters',
  templateUrl: 'filters.component.html'
})

export class FiltersComponent implements OnInit, OnDestroy {

  constructor( private appSettings: AppSettingsService,
               private router: Router,
               private state: StateService) { }

  public ngOnDestroy(): void {

  }

  public ngOnInit(): void {

  }

  public applyFilters(): void {
    this.state.setIsFilterDialogOpen(false);
  }

  public resetFilters(): void {

  }

}
