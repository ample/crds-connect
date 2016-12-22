import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { BaseRequestOptions, Response, HttpModule, Http, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResponseOptions } from '@angular/http';
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';

import { IFrameParentService } from './iframe-parent.service';
import { StoreService } from './store.service';
import { SessionService } from './session.service';
import { ValidationService } from './validation.service';
import { APIService } from './api.service';
import { StateService } from './state.service';

class MockActivatedRoute {
    public snapshot = {
        queryParams: []
    };
}

describe('Service: API', () => {

    let mockBackend: MockBackend;
    let mockDonor = '{"stripe_token": 123,"email_address":"test@test.com","first_name":"John","last_name":"Doe", "rest_method":"post"}';
    let mockPostPaymentResp = '{"amount":1,"email":"scrudgemcduckcrds@mailinator.com","status":0,"include_on_giving_h'
    + 'istory":false,"include_on_printed_statement":false,"date":"0001-01-01T00:00:00","fee":0.0,"payment_id":125,"'
    + 'source":{"type":0},"distributions":[]}';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                IFrameParentService,
                MockBackend,
                SessionService,
                BaseRequestOptions,
                ValidationService,
                APIService,
                StateService,
                StoreService,
                CookieService,
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                },
                { provide: ActivatedRoute, useClass: MockActivatedRoute }

            ],
            imports: [
                HttpModule
            ]
        });

        mockBackend = getTestBed().get(MockBackend);
        TestBed.compileComponents();
    }));



});
