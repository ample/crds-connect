import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { ToastsManager } from 'ng2-toastr';

import { BlandPageService } from '../../services/bland-page.service';
import { HostApplicationHelperService } from '../../services/host-application-helper.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';

import { Address } from '../../models/address';
import { HostRequestDto } from '../../models/host-request-dto';
import { HostApplicatonForm } from '../../models/host-application-form';
import { DetailedUserData } from '../../models/detailed-user-data';

@Component({
  selector: 'app-host-application',
  templateUrl: 'host-application.html'
})
export class HostApplicationComponent implements OnInit {

  public userData: DetailedUserData;
  public hostForm: FormGroup;
  public homeAddress: Address;
  public groupAddress: Address;
  public isFormSubmitted: boolean = false;
  public errorMessage: string = '';

  constructor(
    private blandPageService: BlandPageService,
    private hlpr: HostApplicationHelperService,
    private loginRedirectService: LoginRedirectService,
    private route: ActivatedRoute,
    private router: Router,
    private session: SessionService,
    private store: StoreService,
    private toast: ToastsManager,
    private state: StateService
  ) {}

  public ngOnInit() {
    this.userData = this.route.snapshot.data['userData'];
    this.homeAddress = this.userData.address;
    this.groupAddress = new Address(null, '', '', '', '', '', null, null, null, null);

    this.hostForm = new FormGroup({
      isHomeAddress: new FormControl(true, [Validators.required]),
      contactNumber: new FormControl('555-555-5555', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]),
      gatheringDescription: new FormControl('This is your gathering description', [Validators.required, Validators.maxLength(500)])
    });

    this.state.setLoading(false);
  }

  public onSubmit ({ value, valid }: { value: HostApplicatonForm, valid: boolean }) {

    this.isFormSubmitted = true;

    let dto: HostRequestDto = this.hlpr.convertFormToDto(value, this.userData.contactId);

    this.toast.error('Address form submitted! Testing toaster.');
    console.log('Address form submitted');
    console.log(value);
    console.log(dto);

  }

}
