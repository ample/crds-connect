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
import { usStatesList } from '../../shared/constants'


@Component({
  selector: 'app-add-me-to-map',
  templateUrl: 'add-me-to-map.component.html',
  styleUrls: ['add-me-to-map.component.css']
})
export class AddMeToMapMapComponent implements OnInit {

  public userData: UserDataForPinCreation;
  public addMeToMapFormGroup: FormGroup;
  public stateList: Array<string>;
  public submissionError = false;

  constructor(private api: APIService,
              private fb: FormBuilder,
              private hlpr: AddMeToTheMapHelperService,
              private content: ContentService,
              private locationService: LocationService,
              private router: Router,
              private route: ActivatedRoute,
              private state: StateService) { }


  public ngOnInit(): void {
    this.state.setLoading(false);
    this.userData = this.route.snapshot.data['userData'];
    this.stateList = usStatesList;

    this.addMeToMapFormGroup = new FormGroup({
      addressLine1: new FormControl(this.hlpr.getStringField(this.userData, 'addressLine1'), [Validators.required]),
      addressLine2: new FormControl(this.hlpr.getStringField(this.userData, 'addressLine2')),
      city: new FormControl(this.hlpr.getStringField(this.userData, 'city'), [Validators.required]),
      state: new FormControl(this.hlpr.getStringField(this.userData, 'state'), [Validators.required]),
      zip: new FormControl(this.hlpr.getStringField(this.userData, 'zip'), [Validators.required])
    });
  }


  public onSubmit({ value, valid }: { value: any, valid: boolean }) {

    this.setSubmissionErrorWarningTo(false);
    value.isFormDirty = this.addMeToMapFormGroup.dirty;

    let pinToSubmit: Pin = this.hlpr.createNewPin(value, this.userData );

    this.api.postPin(pinToSubmit).subscribe(
      next => {
        this.router.navigate(['/now-a-pin']);
      },
      err => {
        this.setSubmissionErrorWarningTo(true);
      }
    );
  }

  public setSubmissionErrorWarningTo(isErrorActive) {
    this.submissionError = isErrorActive;
  }

  public closeClick()  {
    this.router.navigate(['/map']);
  }

}
