import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AnalyticsService } from '../../services/analytics.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { SessionService } from '../../services/session.service';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';

@Component({
  selector: 'app-authentication',
  templateUrl: 'authentication.component.html'
})
export class AuthenticationComponent implements OnInit {
  public buttonText: string = 'Next';
  public email: string;
  public form: FormGroup;
  public formSubmitted: boolean;
  public loginException: boolean;
  public showMessage: boolean = false;
  public signinOption: string = 'Sign In';
  public emailRegex: string = '[^\\.]{1,}((?!.*\\.\\.).{1,}[^\\.]{1}|)\\@[a-zA-Z0-9\-]{1,}\\.[a-zA-Z]{2,}';

  private forgotPasswordUrl: string;
  private helpUrl: string;

  constructor(
    private analyticsService: AnalyticsService,
    private fb: FormBuilder,
    private router: Router,
    public redirectService: LoginRedirectService,
    public state: StateService,
    private store: StoreService,
    private cookieService: CookieService,
    public session: SessionService
  ) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.state.navigatedBackToNeighbors = true;
  }

  public ngOnInit(): void {
    window.scrollTo(0, 0);
    this.helpUrl = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/help`;
    this.forgotPasswordUrl = `//${process.env.CRDS_ENV || 'www'}.crossroads.net/forgot-password`;

    this.form = this.fb.group({
      email: [this.store.email, [<any>Validators.required, <any>Validators.pattern(this.emailRegex)]],
      password: ['', <any>Validators.required]
    });

    this.form.valueChanges.subscribe((value: any) => {
      this.store.email = value.email;
    });

    this.state.setLoading(false);
  }

  public submitLogin(): boolean {
    this.formSubmitted = true;
    this.state.setLoading(true);
    this.loginException = false;
    if (this.form.valid) {
      this.session.postLogin(this.form.get('email').value, this.form.get('password').value)
      .subscribe(
        (user) => {
          this.analyticsService.identify(user.userId);
          this.store.loadUserData();
          // TODO: Completed for SSO config, not sure if always want to route to host-signup after signin
          this.redirectService.redirectToTarget();
        },
        (error) => {
          this.loginException = true;
          this.state.setLoading(false);
        }
      );
    } else {
      this.loginException = true;
      this.form.controls['email'].markAsTouched();
      this.form.controls['password'].markAsTouched();
      this.state.setLoading(false);
    }
    return false;
  }

  public back(): boolean {
    this.state.navigatedBackToNeighbors = true;
    this.redirectService.cancelRedirect();
    return false;
  }

  public formInvalid(field): boolean {
    return !this.form.controls[field].valid;
  }

}
