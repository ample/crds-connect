import { Angulartics2 } from 'angulartics2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
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
  public submitted: boolean = false;
  public errorMessage: string = '';

  constructor(
    private hlpr: AddMeToTheMapHelperService,
    private session: SessionService,
    private loginRedirectService: LoginRedirectService,
    private route: ActivatedRoute,
    private router: Router,
    private store: StoreService,
    private blandPageService: BlandPageService,
    private state: StateService
  ) {}

  public ngOnInit() {
    this.userData = this.route.snapshot.data['userData'];

    this.hostForm = new FormGroup({
      isHomeAddress: new FormControl(true, [Validators.required]),
      contactNumber: new FormControl('555-555-5555', [Validators.required]),
      gatheringDescription: new FormControl('This is your gathering description', [Validators.required])
    });

    this.state.setLoading(false);
  }

  public onSubmit ({ value, valid }: { value: any, valid: boolean }) {

    console.log('Address form submitted');
    console.log(value);

  }

}
