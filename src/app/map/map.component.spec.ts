/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { LocationService } from '../services/location.service';
import { MapComponent } from './map.component';

describe('Component: Map', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapComponent
      ],
      imports: [
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        })
      ],
      providers: [
        LocationService
      ]
    });
    this.fixture = TestBed.createComponent(MapComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});



