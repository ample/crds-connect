import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../services/app-settings.service';
import { Pin, pinType } from '../../../models/pin';
import { awsFieldNames } from '../../../shared/constants';

@Component({
  selector: 'kids-welcome',
  templateUrl: 'kids-welcome.component.html'
})

export class KidsWelcomeComponent {
  private welcome: boolean = null;
  private selected: boolean = false;
  private filterString: string = '';

  constructor( private appSettings: AppSettingsService,
               private router: Router) { }


  public kidsWelcome(value: boolean): void {
        this.selected = true;
        this.welcome = value;
  }
  public getFilterString(): string {
    // AWS value is a number, not a string
    let welcomeFlag = this.welcome ? 1 : 0;
    return this.filterString = (this.welcome != null || this.welcome != undefined) ?
      (awsFieldNames.GROUP_KIDS_WELCOME + ': ' + welcomeFlag) :
      null;
  }

}
