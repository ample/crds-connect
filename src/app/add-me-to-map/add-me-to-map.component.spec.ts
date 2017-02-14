/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { LocationService } from '../services/location.service';
import { AddMeToMapMapComponent } from './add-me-to-map.component';

describe('Component: Map', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddMeToMapMapComponent
      ],
      imports: [
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        }),
        ReactiveFormsModule
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



