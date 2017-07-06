import { Angulartics2 } from 'angulartics2';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../services/app-settings.service';
import { Pin, pinType } from '../../../models/pin';

@Component({
  selector: 'kids-welcome',
  templateUrl: 'kids-welcome.component.html'
})

export class KidsWelcomeComponent {
  private welcome: boolean = false;
  private selected: boolean = false;
  constructor( private appSettings: AppSettingsService,
               private router: Router) { }


  public kidsWelcome(value: boolean): void {
        this.selected = true;
        this.welcome = value;
    }
}
