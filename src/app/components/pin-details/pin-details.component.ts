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
  public submitted: boolean = false;
  public errorMessage: string = '';
  public buttonText: string = 'Update';
  public isPinOwner: boolean = false;
  public isLoggedIn: boolean = false;
  public isGatheringPin: boolean = false;
  public isSmallGroupPin: boolean = false;
  public sayHiText: string = '';
  public isInGathering: boolean = false;
  public user: Pin;
  private trialMemberApprovalMessage: string;

  constructor(
    private location: PlatformLocation,
    private router: Router,
    private route: ActivatedRoute,
    private session: SessionService,
    private state: StateService,
    private pinService: PinService
  ) {}

  public ngOnInit() {
    this.state.setLoading(true);
    this.state.setPageHeader('connect', '/');

    this.pin = this.route.snapshot.data['pin'];
    this.user = this.route.snapshot.data['user'];

    this.approveOrDisapproveTrialMember();

    if (this.pin.pinType === pinType.GATHERING) {
      this.isGatheringPin = true;
    } else if (this.pin.pinType === pinType.SMALL_GROUP){
      this.isSmallGroupPin = true;
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

  private approveOrDisapproveTrialMember() {
    const approved: boolean = (this.route.snapshot.paramMap.get('approved') === 'true');
    const trialMemberId: string = this.route.snapshot.paramMap.get('trialMemberId');
    const baseUrl = process.env.CRDS_GATEWAY_CLIENT_ENDPOINT;

    if(approved && trialMemberId) {
      this.session.post(`${baseUrl}api/v1.0.0/finder/pin/tryagroup/${this.pin.gathering.groupId}/${approved}/${trialMemberId}`, null)
      .subscribe(
        success => this.trialMemberApprovalMessage = approved ? 'Trial member was approved' : 'Trial member was disapproved',
        failure => this.trialMemberApprovalMessage = 'Error approving trial member'
      );
    }
  }
}
