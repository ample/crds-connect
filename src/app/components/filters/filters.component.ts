import { Angulartics2 } from 'angulartics2';

import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../services/app-settings.service';
import { FilterService } from '../../services/filter.service';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';

import { KidsWelcomeComponent } from './kids-welcome/kids-welcome.component';
import { AgeGroupsComponent } from './age-groups/age-groups.component';

import { PinSearchRequestParams } from '../../models/pin-search-request-params';


@Component({
  selector: 'app-filters',
  templateUrl: 'filters.component.html'
})

export class FiltersComponent implements OnInit {
  // Search string coming in will always be Keyword, not location, becuase filters are ONLY on groups, not connect
  @Input() searchKeywordString: string;
  @ViewChild(KidsWelcomeComponent) public childKidsWelcomeComponent: KidsWelcomeComponent;
  @ViewChild(AgeGroupsComponent) public childAgeGroupsComponent: AgeGroupsComponent;

  private locationFormGroup: FormGroup;
  private formName: string;
  private location: string;

  constructor( private appSettings: AppSettingsService,
               private filterService: FilterService,
               private router: Router,
               private pinService: PinService,
               private state: StateService) { }

    ngOnInit() {
      this.locationFormGroup = new FormGroup({
          location: new FormControl(this.location, []),
      });
    }

  private applyFilters(): void {
    this.state.myStuffActive = false;
    this.state.setMyViewOrWorldView('world');
    this.state.setIsFilterDialogOpen(false);

    let filterString: string = this.filterService.buildFilters();
    this.router.navigate([], { queryParams: {filterString: filterString } });
    let pinSearchRequest = new PinSearchRequestParams(this.location, this.searchKeywordString, filterString);
    this.state.lastSearch.search = this.searchKeywordString;
    this.pinService.emitPinSearchRequest(pinSearchRequest);

  }

  public resetFilters(): void {
    this.childKidsWelcomeComponent.reset();
    this.childAgeGroupsComponent.reset();
    this.state.setIsFilterDialogOpen(false);
  }

  public onSubmit(): void {
    this.location = this.locationFormGroup.controls.location.value;
console.log(this.location);
    this.applyFilters();
  }

}
