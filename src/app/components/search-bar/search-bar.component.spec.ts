/* tslint:disable:no-unused-variable */
import { Component, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Http, Response, RequestOptions } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { UserLocationService } from '../../services/user-location.service';
import { SearchBarComponent } from './search-bar.component';
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';

import { ContentService } from '../../services/content.service';
import { IFrameParentService } from '../../services/iframe-parent.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { LocationService } from '../../services/location.service';
import { PinService}  from '../../services/pin.service';
import { BlandPageService } from '../../services/bland-page.service';

describe('Component: Search Bar', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchBarComponent,
        MapContentComponent,
        MapFooterComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule, FormsModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyArKsBK97N0Wi-69x10OL7Sx57Fwlmu6Cs'
        })
      ],
      providers: [
        LocationService,
        PinService,
        IFrameParentService,
        StoreService,
        StateService,
        SessionService,
        CookieService,
        Angulartics2,
        ContentService,
        LoginRedirectService,
        BlandPageService
      ]
    });
    this.fixture = TestBed.createComponent(SearchBarComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should toggle view', () => {
    expect(this.component.buttontext).toBe(undefined);
    this.component.toggleView();
    expect(this.component.buttontext).toBe('Map');
  });

  it('should emit search event', (done) => {
    this.component.search.subscribe( g => {
      expect(g).toEqual('Phil Is Cool!');
      done();
    });
    this.component.onSearch('Phil Is Cool!');
  });

});

