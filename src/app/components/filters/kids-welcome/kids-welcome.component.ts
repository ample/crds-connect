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
  private areKidsWelcome: boolean = null;
  private selected: boolean = false;

  constructor( private appSettings: AppSettingsService,
               private filterService: FilterService) { }


  public kidsWelcome(value: boolean): void {
        this.selected = true;
        this.areKidsWelcome = value;
        this.setFilterString();
  }

// TODO build string in service
  private setFilterString(): void {
    // AWS value is a number, not a string
    let welcomeFlag = this.areKidsWelcome ? 1 : 0;
    this.filterService.filterStringKidsWelcome = (this.areKidsWelcome != null || this.areKidsWelcome !== undefined) ?
      `(or ${awsFieldNames.GROUP_KIDS_WELCOME}: ${welcomeFlag})` :
      null;
  }

  public reset() {
    this.areKidsWelcome = null;
    this.selected = false;
  }
}
