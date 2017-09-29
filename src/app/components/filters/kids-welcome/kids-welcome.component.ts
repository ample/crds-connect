import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../filter.service';
import { Pin, pinType } from '../../../models/pin';
import { awsFieldNames } from '../../../shared/constants';

@Component({
  selector: 'kids-welcome',
  templateUrl: 'kids-welcome.component.html'
})

export class KidsWelcomeComponent implements OnInit {
  public areKidsWelcome: boolean = null;
  public selected: boolean = false;

  constructor( private appSettings: AppSettingsService,
               private filterService: FilterService) { }

  public ngOnInit() {
    this.setSelectedFilter();
  }


  public kidsWelcome(value: boolean): void {
        this.selected = true;
        this.areKidsWelcome = value;
        this.setFilterString();
  }

  private setFilterString(): void {
    let welcomeFlag = this.areKidsWelcome ? 1 : 0;
    let haveKidsWelcomeValue = this.areKidsWelcome != null || this.areKidsWelcome !== undefined;
    this.filterService.setFilterStringKidsWelcome(welcomeFlag, haveKidsWelcomeValue);
  }

  public reset() {
    this.areKidsWelcome = null;
    this.selected = false;
  }

  public setSelectedFilter(): void {
    if (this.filterService.filterStringKidsWelcome != null) {
      const filter = this.filterService.filterStringKidsWelcome.replace(/\D/g, '');
      this.selected = true;
      if (+filter === 0) {
        this.areKidsWelcome = false;
      } else {
        this.areKidsWelcome = true;
      }
      this.setFilterString();
    }
  }
}
