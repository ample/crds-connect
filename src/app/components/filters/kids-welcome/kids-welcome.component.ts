import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { FilterService } from '../../../services/filter.service';
import { Pin, pinType } from '../../../models/pin';
import { awsFieldNames } from '../../../shared/constants';

@Component({
  selector: 'kids-welcome',
  templateUrl: 'kids-welcome.component.html'
})

export class KidsWelcomeComponent implements OnInit {
  public areKidsWelcome: boolean = null;
  public selected: boolean = false;

  constructor(private filterService: FilterService) { }

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
    const filter = this.filterService.getSelectedKidsWelcomeFlag();
    if (filter) {
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
