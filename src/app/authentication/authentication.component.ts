import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APIService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  public buttonText: string = 'Next';
  public email: string;
  public form: FormGroup;
  public formSubmitted: boolean;
  public loginException: boolean;
  public showMessage: boolean = false;
  public signinOption: string = 'Sign In';
  public userPmtInfo: any;
  public emailRegex: string = '[^\\.]{1,}((?!.*\\.\\.).{1,}[^\\.]{1}|)\\@[a-zA-Z0-9\-]{1,}\\.[a-zA-Z]{2,}';

  private forgotPasswordUrl: string;
  private helpUrl: string;

  constructor(
    private api: APIService,
    private fb: FormBuilder,
    private router: Router,
    private state: StateService,
    private store: StoreService
  ) { }

  public ngOnInit(): void {
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
      this.api.postLogin(this.form.get('email').value, this.form.get('password').value)
      .subscribe(
        (user) => {
          console.log('Login successful, user: ');
          console.log(user);
          this.store.loadUserData();
          this.adv();
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

  public adv(): boolean {
    console.log('This is a placeholder for navigating to the next page after successful login');
    this.state.setLoading(false);
    return false;
  }

  public back(): boolean {
    // navigate back IF we will provide this option
    return false;
  }

  public formInvalid(field): boolean {
    return !this.form.controls[field].valid;
  }

  public hideBack() {
    // if condition which returns 'true' in order to hide the back button, may not be used
    return false;
  }
}
