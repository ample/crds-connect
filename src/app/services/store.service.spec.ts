/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StoreService } from './store.service';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from './session.service';
import { StateService } from './state.service';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { CookieService } from 'ngx-cookie';


class MockActivatedRoute {
  public snapshot = {
    queryParams: []
  };
}

describe('Service: Store', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoreService,
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
