import { Angulartics2 } from 'angulartics2';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APIService } from '../services/api.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';


@Component({
  selector: 'app-host-application',
  templateUrl: 'host-application.html'
})
export class HostApplicationComponent implements OnInit {

  public form: FormGroup;
  public submitted: boolean = false;
  public errorMessage: string = '';

  constructor() {
  }

  public ngOnInit() {
  }
}
