import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../services/api.service';
import { StateService } from '../../services/state.service';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { LocationService } from '../../services/location.service';
import { LookupTable } from '../../models/lookup-table';
import { Pin } from '../../models/pin';

import { UserDataForPinCreation } from '../../models/user-data-for-pin-creation';
import { Address } from '../../models/address';
import { usStatesList } from '../../shared/constants';


@Component({
  selector: 'app-add-me-to-map',
  templateUrl: 'add-me-to-map.component.html',
  styleUrls: ['add-me-to-map.component.css']
})
export class AddMeToMapComponent implements OnInit {

  public userData: UserDataForPinCreation;
  public addMeToMapFormGroup: FormGroup;
  public stateList: Array<string>;

  constructor(private api: APIService,
              private fb: FormBuilder,
              private hlpr: AddMeToTheMapHelperService,
              private content: ContentService,
              private locationService: LocationService,
              private router: Router,
              private route: ActivatedRoute,
              private state: StateService) { }


  public ngOnInit(): void {
    this.userData = this.route.snapshot.data['userData'];
    this.state.setLoading(false);
  }

  public onSubmit(value) {
    if (value) {
      this.router.navigate(['/now-a-pin']);
    }
  }

  public closeClick()  {
    this.router.navigate(['/map']);
  }

}

