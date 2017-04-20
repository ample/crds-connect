import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Angulartics2 } from 'angulartics2';
import { ToastsManager } from 'ng2-toastr';

import { BlandPageService } from '../../services/bland-page.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';

import { DetailedUserData } from '../../models/detailed-user-data';

@Component({
  selector: 'app-host-application',
  templateUrl: 'host-application.html'
})
export class HostApplicationComponent implements OnInit {

  public userData: DetailedUserData;
  public hostForm: FormGroup;
  public isFormSubmitted: boolean = false;
  public errorMessage: string = '';

  constructor(
    private blandPageService: BlandPageService,
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

    this.hostForm = new FormGroup({
      isHomeAddress: new FormControl(true, [Validators.required]),
      contactNumber: new FormControl('555-555-5555', [Validators.required, Validators.minLength(7), Validators.maxLength(15)]),
      gatheringDescription: new FormControl('This is your gathering description', [Validators.required, Validators.maxLength(500)])
    });

    this.state.setLoading(false);
  }

  public onSubmit ({ value, valid }: { value: any, valid: boolean }) {

    this.isFormSubmitted = true;

    this.toast.error('Address form submitted! Testing toaster.');
    console.log('Address form submitted');
    console.log(value);

  }

}
