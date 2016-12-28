/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StateService } from './state.service';
import { CookieService } from 'angular2-cookie/core';

describe('Service: State', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateService]
    });
  });

  it('should create an instance', inject([StateService], (service: any) => {
      expect(service).toBeTruthy();
  }));

});
