import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentService } from '../services/content.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../services/api.service';
import { AddMeToTheMapHelperService } from '../services/add-me-to-map-helper.service'
import { LocationService } from '../services/location.service';
import { LookupTable } from '../models/lookup-table';
import { Pin } from '../models/pin';

import { UserDataForPinCreation } from '../models/user-data-for-pin-creation';
import { Address } from '../models/address';


@Component({
  selector: 'app-add-me-to-map',
  templateUrl: 'add-me-to-map.component.html',
  styleUrls: ['add-me-to-map.component.css']
})
export class AddMeToMapMapComponent implements OnInit {

  public userData: UserDataForPinCreation;
  public stateList: Array<LookupTable>;
  public addMeToMapFormGroup: FormGroup;
  public stateListForSelect: Array<any>;

  constructor(private api: APIService,
              private fb: FormBuilder,
              private helper: AddMeToTheMapHelperService,
              private content: ContentService,
              private locationService: LocationService,
              private router: Router,
              private route: ActivatedRoute) { }


  public ngOnInit(): void {

    this.userData = this.route.snapshot.data['userData'];
    this.stateList = this.route.snapshot.data['stateList'];
    console.log(this.userData);
    console.log(this.stateList);

    this.stateListForSelect = this.stateList.map(state => {
      let formmatedState = {label: state.dp_RecordName, value: state.dp_RecordID};
      return formmatedState;
    });

    this.addMeToMapFormGroup = new FormGroup({
      addressLine1: new FormControl('', [Validators.required]),
      addressLine2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
    });

  }

  public onSubmit({ value, valid }: { value: any, valid: boolean }) {
    // console.log(value, valid);
    this.api.postPin(value).subscribe(
      next => {this.router.navigate(['/now-a-pin'])},
      err => this.toggleSubmissionError()
    );
  }

  public toggleSubmissionError() {
    console.log('SubmissionError')
  }

}

