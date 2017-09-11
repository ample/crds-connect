import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AnalyticsService } from '../../services/analytics.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { SessionService } from '../../services/session.service';
import { LoginRedirectService } from '../../services/login-redirect.service';

import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  public errorMessage: string = '';
  public submitted: boolean = false;
  public regForm: FormGroup;
  public duplicateUser: boolean = false;
  private termsOfServiceUrl: string;
  private privacyPolicyUrl: string;
  private forgotPasswordUrl: string;
  private emailRegex: string = '[^\\.]{1,}((?!.*\\.\\.).{1,}[^\\.]{1}|)\\@[a-zA-Z0-9\-]{1,}\\.[a-zA-Z]{2,}';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private state: StateService,
    private store: StoreService,
    private session: SessionService,
    private redirectService: LoginRedirectService,
    private analyticsService: AnalyticsService
  ) {

  }

  ngOnInit() {
        this.regForm = this.fb.group({
      firstName: ['', [<any>Validators.required]],
      lastName: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern(this.emailRegex)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(8)]]
    });
    window.scrollTo(0, 0);
    this.privacyPolicyUrl = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/privacypolicy`;
    this.forgotPasswordUrl = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/forgot-password`;
    this.termsOfServiceUrl = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/terms-of-service`;

    this.state.setLoading(false);
  }

  signin() {
    this.router.navigate(['signin']);
  }

  adv(): void {
    this.redirectService.redirectToTarget();
  };

  submitRegistration() {
    this.submitted = true;
    if (this.regForm.valid) {
      this.state.setLoading(true);
      let newUser = new User(
        this.regForm.get('firstName').value,
        this.regForm.get('lastName').value,
        this.regForm.get('email').value,
        this.regForm.get('password').value
      );
      this.session.postUser(newUser).subscribe(
        user => {
          if (!this.session.isLoggedIn()) {
            this.loginNewUser(newUser.email, newUser.password);
          }

        },
        error => {
          if (JSON.parse(error._body).message === 'Duplicate User') {
            this.state.setLoading(false);
            this.duplicateUser = true;
          }
        }
      );
    } else {
      this.regForm.controls['firstName'].markAsTouched();
      this.regForm.controls['lastName'].markAsTouched();
      this.regForm.controls['email'].markAsTouched();
      this.regForm.controls['password'].markAsTouched();
    }

    this.submitted = true;
    return false;
  }

  loginNewUser(email, password) {
    this.session.postLogin(email, password)
      .subscribe(
      (user) => {
        this.analyticsService.newUserRegistered(user.userId);
        this.analyticsService.identifyLoggedInUser(
          user.userId,
          this.regForm.get('email').value,
          this.regForm.get('firstName').value,
          this.regForm.get('lastName').value);
        this.store.loadUserData();
        this.adv();
      },
      (error) => this.state.setLoading(false)
      );
  }

  switchMessage(errors: any): string {
    let ret = `is <em>invalid</em>`;
    if (errors.required !== undefined) {
      ret = `is <u>required</u>`;
    }
    return ret;
  }

}
