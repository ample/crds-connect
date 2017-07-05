import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../services/app-settings.service';
import { Pin, pinType } from '../../../models/pin';

@Component({
  selector: 'age-groups',
  templateUrl: 'age-groups.component.html'
})

export class AgeGroupsComponent implements OnInit, OnDestroy {
  private selected: boolean = false;
  constructor( private appSettings: AppSettingsService,
               private router: Router) { }

  public ngOnDestroy(): void {

  }

  public ngOnInit(): void {

  }

  public onSelect(): void {
        this.selected = !this.selected;
    }
}
