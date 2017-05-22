import { Angulartics2 } from 'angulartics2';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PlatformLocation } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Pin, pinType } from '../../models/pin';
import { PinService } from '../../services/pin.service';
import { Address } from '../../models/address';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { SessionService } from '../../services/session.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-pin-detail',
  templateUrl: 'pin-details.html'
})
export class PinDetailsComponent implements OnInit {

  @Input() pin: Pin;
  public pinType: any = pinType;
  public submitted: boolean = false;
  public errorMessage: string = '';
  public buttonText: string = 'Update';
  public isPinOwner: boolean = false;
  public isLoggedIn: boolean = false;
  public isGatheringPin: boolean = false;
  public sayHiText: string = '';
  public isInGathering: boolean = false;
  public user: Pin;

  constructor(
    private location: PlatformLocation,
    private router: Router,
    private route: ActivatedRoute,
    private session: SessionService,
    private state: StateService,
    private pinService: PinService
  ) { }

  public ngOnInit() {
    this.state.setLoading(true);
    this.state.setPageHeader('connect', '/');

    this.pin = this.route.snapshot.data['pin'];
    this.user = this.route.snapshot.data['user'];

    if (this.pin.pinType === pinType.GATHERING) {
      this.isGatheringPin = true;
    }

    if (this.session.isLoggedIn()) {
      this.isLoggedIn = true;
      this.isPinOwner = this.doesLoggedInUserOwnPin();
    }
    this.state.setLoading(false);
  }

  private doesLoggedInUserOwnPin() {
    return this.pinService.doesLoggedInUserOwnPin(this.pin);
  }
}
