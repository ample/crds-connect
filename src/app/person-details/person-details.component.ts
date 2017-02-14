import { Angulartics2 } from 'angulartics2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APIService } from '../services/api.service';
import { ContentService } from '../services/content.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';
import { LoginRedirectService } from '../services/login-redirect.service';



@Component({
  selector: 'app-person-detail',
  templateUrl: 'person-details.html'
})
export class PersonDetailsComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean = false;
  public errorMessage: string = '';
  public person;
  public isLoggedInUser: boolean;
  public isLoggedIn: boolean;

  constructor(private api: APIService,
              private content: ContentService,
              private loginRedirectService: LoginRedirectService,
              private router: Router,
              private store: StoreService
              ) {
  }

  public ngOnInit() {
    this.person = { firstName: 'Joe', lastName: 'Ker', gathering: null, address: {street1: '123 Street', street2: 'apt B', city:'city!', state:'OH', zip:'12345' } };
    this.isLoggedInUser = true;
    this.isLoggedIn = this.api.isLoggedIn();
  }

  public sayHi() {
    console.log('hi');
  }

}
