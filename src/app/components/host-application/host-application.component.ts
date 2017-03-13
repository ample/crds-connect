import { Angulartics2 } from 'angulartics2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APIService } from '../../services/api.service';
import { ContentService } from '../../services/content.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { LoginRedirectService } from '../../services/login-redirect.service';


@Component({
  selector: 'app-host-application',
  templateUrl: 'host-application.html'
})
export class HostApplicationComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean = false;
  public errorMessage: string = '';

  constructor(private api: APIService,
              private content: ContentService,
              private loginRedirectService: LoginRedirectService,
              private router: Router,
              private store: StoreService
              ) {
  }

  public ngOnInit() {
    debugger;
    if (!this.api.isLoggedIn()) {
        this.loginRedirectService.redirectToLogin(this.router.routerState.snapshot.url);
    }
  }

}
