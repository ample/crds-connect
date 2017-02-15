import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { LocationService } from '../services/location.service';
import { LookupTable } from '../models/lookup-table';

@Component({
  selector: 'app-add-me-to-map',
  templateUrl: 'add-me-to-map.component.html',
  styleUrls: ['add-me-to-map.component.css']
})
export class AddMeToMapMapComponent implements OnInit {

  public userData: any;
  public stateList: Array<LookupTable>;
  public addMeToMapFormGroup: FormGroup;
  public stateListForSelect: Array<any>;

  constructor(private fb: FormBuilder,
              private locationService: LocationService,
              private route: ActivatedRoute) { }


  public ngOnInit(): void {

    this.userData = this.route.snapshot.data['userData'];
    this.stateList = this.route.snapshot.data['stateList'];
    console.log(this.stateList);

    this.stateListForSelect = this.stateList.map(state => {
      var formmatedState = {label: state.dp_RecordName, value: state.dp_RecordID}
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

}

