import { Angulartics2 } from 'angulartics2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BlandPageService } from '../../services/bland-page.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-host-application',
  templateUrl: 'host-application.html'
})
export class HostApplicationComponent implements OnInit {

  public userData: any;
  public form: FormGroup;
  public submitted: boolean = false;
  public errorMessage: string = '';

  constructor(private session: SessionService,
    private loginRedirectService: LoginRedirectService,
    private route: ActivatedRoute,
    private router: Router,
    private store: StoreService,
    private blandPageService: BlandPageService,
    private state: StateService
  ) {
  }

  public ngOnInit() {
    this.userData = this.route.snapshot.data['userData'];
    this.state.setLoading(false);
  }

  public btnClickGettingStarted() {
    this.blandPageService.goToGettingStarted();
  }

}
