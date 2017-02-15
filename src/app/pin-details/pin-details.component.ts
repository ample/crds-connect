import { Angulartics2 } from 'angulartics2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../services/api.service';
import { ContentService } from '../services/content.service';
import { Pin } from '../models/pin';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { LoginRedirectService } from '../services/login-redirect.service';
import { SessionService } from '../services/session.service';


@Component({
  selector: 'app-pin-detail',
  templateUrl: 'pin-details.html'
})
export class PinDetailsComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean = false;
  public errorMessage: string = '';
  public isLoggedInUser: boolean = false;
  public isLoggedIn: boolean = false;
  public pin: Pin;

  constructor(private api: APIService,
              private content: ContentService,
              private loginRedirectService: LoginRedirectService,
              private router: Router,
              private route: ActivatedRoute,
              private session: SessionService,
              private state: StateService
              ) {

  }

  public ngOnInit() {
    this.state.setLoading(true);
    this.pin = this.route.snapshot.data['pin'];

    if (this.api.isLoggedIn()) {
      this.isLoggedIn = true;
      this.isLoggedInUser = this.doesLoggedInUserOwnPin();
    }
    this.state.setLoading(false);
  }

  public sayHi() {
    console.log('hi');
  }

  public redirectToLogin() {
    this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url);
  }

  private doesLoggedInUserOwnPin() {
    let contactId = this.session.getContactId();
    return contactId === this.pin.contactId;
  }

}
