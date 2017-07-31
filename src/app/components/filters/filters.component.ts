import { Angulartics2 } from 'angulartics2';

import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { FilterService } from '../../services/filter.service';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';

import { CategoryComponent } from './category/category.component';
import { AgeGroupsComponent } from './age-groups/age-groups.component';
import { GroupTypeComponent } from './group-type/group-type.component';
import { KidsWelcomeComponent } from './kids-welcome/kids-welcome.component';
import { OnlineOrPhysicalGroupComponent } from './online-or-physical-group/online-or-physical-group.component';

import { MeetingTimeComponent } from './meeting-time/meeting-time.component';
import { MeetingDayComponent } from './meeting-day/meeting-day.component';
import { MeetingFrequencyComponent } from './meeting-frequency/meeting-frequency.component';

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
  @ViewChild(OnlineOrPhysicalGroupComponent) public onlineOrPhysicalGroupComponent: OnlineOrPhysicalGroupComponent;
  @ViewChild(GroupTypeComponent) public groupTypeComponent: GroupTypeComponent;
  @ViewChild(CategoryComponent) public childCategoryComponent: CategoryComponent;
  @ViewChild(MeetingTimeComponent) public meetingTimeComponent: MeetingTimeComponent;
  @ViewChild(MeetingDayComponent) public meetingDayComponent: MeetingDayComponent;
  @ViewChild(MeetingFrequencyComponent) public meetingFrequency: MeetingFrequencyComponent;


  public locationFormGroup: FormGroup;
  public location: string;

  constructor( private filterService: FilterService,
               private router: Router,
               private pinService: PinService,
               private state: StateService) { }

  ngOnInit() {
    let savedSearch = this.state.lastSearch;
    this.locationFormGroup = new FormGroup({
        location: new FormControl(this.location, []),
    });

    if ((savedSearch) && savedSearch.location != null){
      this.locationFormGroup.controls['location'].setValue(savedSearch.location);
    }
  }

  public applyFilters(): void {
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
    this.locationFormGroup.controls['location'].setValue('');
    this.state.lastSearch.location = '';
    this.childKidsWelcomeComponent.reset();
    this.childAgeGroupsComponent.reset();
    this.childCategoryComponent.reset();
    this.groupTypeComponent.reset();
    this.meetingTimeComponent.reset();
    this.meetingDayComponent.reset();
    this.meetingFrequency.reset();
    this.onlineOrPhysicalGroupComponent.reset();
    this.filterService.resetFilterString();
    this.state.setIsFilterDialogOpen(false);
    this.onSubmit();
  }

  public onSubmit(): void {
    this.location = this.locationFormGroup.controls.location.value;
    this.applyFilters();
  }

}
