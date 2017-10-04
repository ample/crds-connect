import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { FilterService } from './filter.service';
import { StateService } from '../../services/state.service';

import { CategoryComponent } from './category/category.component';
import { AgeGroupsComponent } from './age-groups/age-groups.component';
import { GroupTypeComponent } from './group-type/group-type.component';
import { KidsWelcomeComponent } from './kids-welcome/kids-welcome.component';
import { OnlineOrPhysicalGroupComponent } from './online-or-physical-group/online-or-physical-group.component';
import { MeetingTimeComponent } from './meeting-time/meeting-time.component';
import { MeetingDayComponent } from './meeting-day/meeting-day.component';
import { MeetingFrequencyComponent } from './meeting-frequency/meeting-frequency.component';


@Component({
  selector: 'app-filters',
  templateUrl: 'filters.component.html'
})

export class FiltersComponent implements OnInit {
  @ViewChild(KidsWelcomeComponent) public childKidsWelcomeComponent: KidsWelcomeComponent;
  @ViewChild(AgeGroupsComponent) public childAgeGroupsComponent: AgeGroupsComponent;
  @ViewChild(OnlineOrPhysicalGroupComponent) public onlineOrPhysicalGroupComponent: OnlineOrPhysicalGroupComponent;
  @ViewChild(GroupTypeComponent) public groupTypeComponent: GroupTypeComponent;
  @ViewChild(CategoryComponent) public childCategoryComponent: CategoryComponent;
  @ViewChild(MeetingTimeComponent) public meetingTimeComponent: MeetingTimeComponent;
  @ViewChild(MeetingDayComponent) public meetingDayComponent: MeetingDayComponent;
  @ViewChild(MeetingFrequencyComponent) public meetingFrequencyComponent: MeetingFrequencyComponent;
  @Output() cancelFilter: EventEmitter<string> = new EventEmitter();

  constructor( private filterService: FilterService,
               private router: Router,
               private state: StateService ) {}

  ngOnInit(): void {
  }

  public resetFilters(): void {
    this.childKidsWelcomeComponent.reset();
    this.childAgeGroupsComponent.reset();
    this.childCategoryComponent.reset();
    this.groupTypeComponent.reset();
    this.meetingTimeComponent.reset();
    this.meetingDayComponent.reset();
    this.meetingFrequencyComponent.reset();
    this.onlineOrPhysicalGroupComponent.reset();
    this.filterService.resetFilterString();
  }

  public cancel(): void {
    this.state.setIsFilterDialogOpen(false);
    this.cancelFilter.emit('filter cancel');
  }

}
