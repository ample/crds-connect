import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { APIService } from '../services/api.service';
import { LoginRedirectService } from '../services/login-redirect.service';
import { StateService } from '../services/state.service';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {

  public lat: number = 39.1031;
  public lng: number = -84.5120;
  public zoom: number = 15;
  public disableDefaultUI = false;
  public zoomControl = true;


  constructor(
    private api: APIService,
    private fb: FormBuilder,
    private router: Router,
    private redirectService: LoginRedirectService,
    private state: StateService,
    private store: StoreService
  ) { }

  public ngOnInit(): void {

  }


}
