/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'angular2-select';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { ContentService } from '../../services/content.service';
import { NowAPinComponent } from './now-a-pin.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('Component: Now A Pin', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        NowAPinComponent
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
        ContentService
      ]
    });
    this.fixture = TestBed.createComponent(NowAPinComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

});



