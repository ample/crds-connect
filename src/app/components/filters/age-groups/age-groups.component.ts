import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../services/app-settings.service';
import { Pin, pinType } from '../../../models/pin';
import { awsFieldNames } from '../../../shared/constants';

@Component({
  selector: 'age-groups',
  templateUrl: 'age-groups.component.html'
})

export class AgeGroupsComponent implements OnInit, OnDestroy {
  private selected: boolean = false;
  private filterString: string = '';

  constructor( private appSettings: AppSettingsService,
               private router: Router) { }

  public ngOnDestroy(): void {

  }

  public ngOnInit(): void {

  }

  public onSelect(): void {
        this.selected = !this.selected;
  }

  public getFilterString(): string {
    // TODO get value of filter
    // AWS value is a list of strings - so need single quotes around each value in filterString
    // iterate over list and add new key/value for each one in the filter string

    // awsFieldNames.GROUP_AGE_RANGE + ': ' + this.formValue // need single quotes around each value since it is a string in aws
    return this.filterString;
  }

}
