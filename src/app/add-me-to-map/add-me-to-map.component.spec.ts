/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'angular2-select';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { LocationService } from '../services/location.service';
import { AddMeToMapMapComponent } from './add-me-to-map.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('Component: Add Me to the Map', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddMeToMapMapComponent
      ],
      imports: [
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        }),
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        SelectModule
      ],
      providers: [
        LocationService
      ]
    });
    this.fixture = TestBed.createComponent(AddMeToMapMapComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});



