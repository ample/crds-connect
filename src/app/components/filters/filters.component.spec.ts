import { DebugElement } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { FilterService } from '../../services/filter.service';
import { StateService } from '../../services/state.service';
import { FiltersComponent } from './filters.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

import { AgeGroupsComponent } from './age-groups/age-groups.component';
import { CategoryComponent } from './category/category.component';
import { GroupTypeComponent } from './group-type/group-type.component';
import { KidsWelcomeComponent } from './kids-welcome/kids-welcome.component';
import { OnlineOrPhysicalGroupComponent } from './online-or-physical-group/online-or-physical-group.component';
import { MeetingTimeComponent } from './meeting-time/meeting-time.component';
import { MeetingDayComponent } from './meeting-day/meeting-day.component';
import { MeetingFrequencyComponent } from './meeting-frequency/meeting-frequency.component';

import { SearchOptions } from '../../models';

import { ViewType } from '../../shared/constants';

describe('FiltersComponent', () => {
  let fixture: ComponentFixture<FiltersComponent>;
  let comp: FiltersComponent;
  let mockFilterService, mockStateService,
    mockRouter, mockSearchBar;

  beforeEach(() => {
    mockFilterService = jasmine.createSpyObj<FilterService>('filterService', ['buildFilters', 'resetFilterString']);
    mockStateService = jasmine.createSpyObj<StateService>('stateService',
    ['setMyViewOrWorldView', 'setIsFilterDialogOpen', 'getCurrentView', 'setCurrentView']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    mockSearchBar = jasmine.createSpyObj<SearchBarComponent>('searchBar', ['setButtonText']);

    TestBed.configureTestingModule({
      declarations: [
        FiltersComponent
      ],
      providers: [
        { provide: FilterService, useValue: mockFilterService },
        { provide: StateService, useValue: mockStateService },
        { provide: Router, useValue: mockRouter },
        { provide: SearchBarComponent, useValue: mockSearchBar }
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, FormsModule]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      this.fixture = TestBed.createComponent(FiltersComponent);
      this.comp = this.fixture.componentInstance;
    });
  }));

  it('should create an instance', () => {
    expect(this.comp).toBeTruthy();
  });

  it('should init', () => {
    // This will eventually be used so leaving it here.
    this.comp.ngOnInit();
  });

  it('should cancel', () => {
    this.comp.cancel();
    expect(mockStateService.setIsFilterDialogOpen).toHaveBeenCalledWith(false);
  });

  describe('Reset', () => {
    beforeEach(async(() => {
      this.comp.childKidsWelcomeComponent = jasmine.createSpyObj<KidsWelcomeComponent>('kidsWelcome', ['reset']);
      this.comp.childAgeGroupsComponent = jasmine.createSpyObj<AgeGroupsComponent>('ageGroups', ['reset']);
      this.comp.childCategoryComponent = jasmine.createSpyObj<CategoryComponent>('category', ['reset']);
      this.comp.groupTypeComponent = jasmine.createSpyObj<GroupTypeComponent>('groupType', ['reset']);
      this.comp.onlineOrPhysicalGroupComponent = jasmine.createSpyObj<OnlineOrPhysicalGroupComponent>('onlineOrPhysical', ['reset', 'getIsVirtualGroup']);
      this.comp.meetingTimeComponent = jasmine.createSpyObj<MeetingTimeComponent>('onlineOrPhysical', ['reset']);
      this.comp.meetingDayComponent = jasmine.createSpyObj<MeetingDayComponent>('onlineOrPhysical', ['reset']);
      this.comp.meetingFrequencyComponent = jasmine.createSpyObj<MeetingFrequencyComponent>('onlineOrPhysical', ['reset']);
    }));

    it('should reset filters', () => {
      this.comp['childKidsWelcomeComponent'].selected = true;
      this.comp.resetFilters();
      expect(this.comp.childKidsWelcomeComponent.reset).toHaveBeenCalled();
      expect(this.comp.childAgeGroupsComponent.reset).toHaveBeenCalled();
      expect(this.comp.childCategoryComponent.reset).toHaveBeenCalled();
      expect(this.comp.groupTypeComponent.reset).toHaveBeenCalled();
      expect(this.comp.onlineOrPhysicalGroupComponent.reset).toHaveBeenCalled();
      expect(this.comp.meetingDayComponent.reset).toHaveBeenCalled();
      expect(this.comp.meetingFrequencyComponent.reset).toHaveBeenCalled();
      expect(this.comp.onlineOrPhysicalGroupComponent.reset).toHaveBeenCalled();
      expect(mockFilterService.resetFilterString).toHaveBeenCalled();
    });
  });
});
