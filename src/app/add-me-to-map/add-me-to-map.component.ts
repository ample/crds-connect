import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-add-me-to-map',
  templateUrl: 'add-me-to-map.component.html',
  styleUrls: ['add-me-to-map.component.css']
})
export class AddMeToMapMapComponent implements OnInit {

  public addMeToMapFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private locationService: LocationService) { }


  public ngOnInit(): void {

    this.addMeToMapFormGroup = new FormGroup({
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zip: new FormControl(''),
    });

  }

}

