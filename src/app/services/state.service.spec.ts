/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StateService } from './state.service';
import { CookieService } from 'angular2-cookie/core';

import { App, AppRoute, appRoute, app } from '../shared/constants';

describe('Service: State', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateService]
    });
  });

  it('should have instance of SearchOptions', inject([StateService], (service: any) => {
    expect(service.lastSearch).toBeDefined();
  }));

  it('should create an instance', inject([StateService], (service: any) => {
      expect(service).toBeTruthy();
  }));

  it('should get a default current view', inject([StateService], (service: any) => {
    expect(service.getCurrentView()).toEqual('map');
  }));

  it('should get a set current view', inject([StateService], (service: any) => {
    service.setCurrentView('list');
    expect(service.getCurrentView()).toEqual('list');
  }));

  it('should get a default showing pin count', inject([StateService], (service: any) => {
    expect(service.getShowingPinCount()).toEqual(10);
  }));

  it('should get a set showing pin count', inject([StateService], (service: any) => {
    service.setShowingPinCount(20);
    expect(service.getShowingPinCount()).toEqual(20);
  }));

  it('should get a default zoom to use', inject([StateService], (service: any) => {
    expect(service.getUseZoom()).toEqual(-1);
  }));

  it('should get a set zoom to use', inject([StateService], (service: any) => {
    service.setUseZoom(10);
    expect(service.getUseZoom()).toEqual(10);
  }));

  it('should set last search search string', inject([StateService], (service: any) => {
    service.setLastSearchSearchString('crazy train');
    expect(service.getLastSearch().search).toBe('crazy train');
  }));
});
