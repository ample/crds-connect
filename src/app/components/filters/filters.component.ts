import { Angulartics2 } from 'angulartics2';

import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
import { FilterService } from '../../services/filter.service';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';

import { KidsWelcomeComponent } from './kids-welcome/kids-welcome.component';
import { AgeGroupsComponent } from './age-groups/age-groups.component';

import { Pin, pinType } from '../../models/pin';
import { PinSearchRequestParams } from '../../models/pin-search-request-params';


@Component({
  selector: 'app-filters',
  templateUrl: 'filters.component.html'
})

export class FiltersComponent implements OnInit, OnDestroy {
  @Input() searchString: string;

  @ViewChild(KidsWelcomeComponent) private childKidsWelcomeComponent: KidsWelcomeComponent;
  @ViewChild(AgeGroupsComponent) private childAgeGroupsComponent: AgeGroupsComponent;

  constructor( private appSettings: AppSettingsService,
               private filterService: FilterService,
               private pinService: PinService,
               private router: Router,
               private state: StateService) { }

  public ngOnDestroy(): void {

  }

  public ngOnInit(): void {

  }

  public applyFilters(): void {

    this.state.myStuffActive = false;
    this.state.setMyViewOrWorldView('world');
    this.state.setIsFilterDialogOpen(false);
    let filterString: string = this.filterService.buildFilters();

    this.router.navigate([], { queryParams: {filterString: filterString } });

    if ((this.searchString !== undefined && this.searchString !== null && this.searchString.length > 0) || filterString != null) {
      let isThisALocationBasedSearch: boolean = this.appSettings.isConnectApp();
      let pinSearchRequest = new PinSearchRequestParams(isThisALocationBasedSearch, this.searchString, filterString);
      this.state.lastSearch.search = this.searchString;
      this.pinService.emitPinSearchRequest(pinSearchRequest);
    }
  }

  public resetFilters(): void {
    this.childKidsWelcomeComponent.reset();
    this.childAgeGroupsComponent.reset();
    this.state.setIsFilterDialogOpen(false);
  }

}
