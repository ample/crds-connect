import { Angulartics2 } from 'angulartics2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { BlandPageService } from '../../services/bland-page.service';


@Component({
  selector: 'app-host-application',
  templateUrl: 'host-application.html'
})
export class HostApplicationComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean = false;
  public errorMessage: string = '';

  constructor(private session: SessionService,
    private loginRedirectService: LoginRedirectService,
    private router: Router,
    private store: StoreService,
    private blandPageService: BlandPageService,
    private stateService: StateService
  ) {
  }

  public ngOnInit() { 
  }

  public btnClickGettingStarted() {
    this.blandPageService.goToGettingStarted();
  }

}
