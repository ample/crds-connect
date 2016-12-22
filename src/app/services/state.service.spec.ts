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

  xit('should set state to hide', inject([StateService], (service: any) => {
      service.paymentState = [
          { path: '/payment', show: true },
          { path: '/authentication', show: true },
          { path: '/billing', show: true },
          { path: '/summary', show: true },
          { path: '/confirmation', show: true }
      ];
      service.hidePage(1);
      expect(service.paymentState[1].show).toBe(false);
  }));

  xit('should set state to show', inject([StateService], (service: any) => {
      service.paymentState = [
          { path: '/payment', show: true },
          { path: '/authentication', show: false },
          { path: '/billing', show: true },
          { path: '/summary', show: true },
          { path: '/confirmation', show: true }
      ];
      service.unhidePage(1);
      expect(service.paymentState[1].show).toBe(true);
  }));

  xit('should get next page to show', inject([StateService], (service: any) => {
      service.paymentState = [
          { path: '/payment', show: true },
          { path: '/authentication', show: false },
          { path: '/billing', show: false },
          { path: '/summary', show: true },
          { path: '/confirmation', show: true }
      ];
      expect(service.getNextPageToShow(0)).toBe('/summary');
  }));

  xit('should get prev page to show', inject([StateService], (service: any) => {
      service.paymentState = [
          { path: '/payment', show: true },
          { path: '/authentication', show: false },
          { path: '/billing', show: false },
          { path: '/summary', show: true },
          { path: '/confirmation', show: true }
      ];
      expect(service.getPrevPageToShow(3)).toBe('/payment');
  }));

  xit('should get page', inject([StateService], (service: any) => {
      service.paymentState = [
          { path: '/payment', show: true },
          { path: '/authentication', show: false },
          { path: '/billing', show: false },
          { path: '/summary', show: true },
          { path: '/confirmation', show: true }
      ];
      expect(service.getPage(2)).toBe('/billing');
  }));

});
