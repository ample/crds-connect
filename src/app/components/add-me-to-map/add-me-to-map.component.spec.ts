/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'angular2-cookie/core';

import { SelectModule } from 'angular2-select';

import { APIService } from '../../services/api.service';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { ContentService } from '../../services/content.service';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { LocationService } from '../../services/location.service';
import { AddMeToMapMapComponent } from './add-me-to-map.component';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { PinService } from '../../services/pin.service';

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
        HttpModule,
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        SelectModule
      ],
      providers: [
        APIService,
        PinService,
        AddMeToTheMapHelperService,
        CookieService,
        LocationService,
        ContentService,
        SessionService,
        StateService
      ]
    });
    this.fixture = TestBed.createComponent(AddMeToMapMapComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});



