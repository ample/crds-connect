import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { Pin, pinType } from '../../../models/pin';
import { awsFieldNames } from '../../../shared/constants';

@Component({
  selector: 'kids-welcome',
  templateUrl: 'kids-welcome.component.html'
})

export class KidsWelcomeComponent {
  private welcome: boolean = null;
  private selected: boolean = false;

  constructor( private appSettings: AppSettingsService,
               private filterService: FilterService) { }


  public kidsWelcome(value: boolean): void {
        this.selected = true;
        this.welcome = value;
  }
  public setFilterString(): void {
    // AWS value is a number, not a string
    let welcomeFlag = this.welcome ? 1 : 0;
    this.filterService.filterStringKidsWelcome = (this.welcome != null || this.welcome != undefined) ?
      `(or ${awsFieldNames.GROUP_KIDS_WELCOME}: ${welcomeFlag})` :
      null;
  }

}
