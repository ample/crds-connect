/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StoreService } from './store.service';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from './session.service';
import { StateService } from './state.service';
import { IFrameParentService } from './iframe-parent.service';
import { APIService } from './api.service';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { CookieService } from 'angular2-cookie/core';


class MockActivatedRoute {
  public snapshot = {
    queryParams: []
  };
}

describe('Service: Store', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IFrameParentService,
        StoreService,
        APIService,
        SessionService,
        StateService,
        CookieService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    });
  });


});
