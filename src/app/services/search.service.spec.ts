/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { Router } from '@angular/router';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions, RequestOptions, Headers } from '@angular/http';
import { CookieService } from 'angular2-cookie/core';

import { AppSettingsService } from '../services/app-settings.service';
import { LoginRedirectService } from './login-redirect.service';
import { SearchService } from './search.service';
import { StateService } from '../services/state.service';
import { Pin } from '../models/pin';

import { MockTestData } from '../shared/MockTestData';
import { ViewType } from '../shared/constants'

import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';

describe('Service: Search', () => {

  let mockAppSettingsService, mockLoginRedirectService, mockState;

  let pin1: Pin = MockTestData.getAPin(1);
  let pin2: Pin  = MockTestData.getAPin(1);
  let pin3: Pin  = MockTestData.getAPin(1);
  let pins: Pin[] = [pin1, pin2, pin3];

  beforeEach(() => {
    mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['redirectToLogin']);
    mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettings', ['isConnectApp', 'isSmallGroupApp', 'routeToNotFoundPage']);
    mockState = jasmine.createSpyObj<StateService>('state', ['getMyViewOrWorldView', 'setMyViewOrWorldView', 'setCurrentView', 'setLoading', 'setLastSearch', 'isSmallGroupApp']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AppSettingsService, useValue: mockAppSettingsService },
        SearchService,
        MockBackend,
        BaseRequestOptions,
        CookieService,
        { provide: StateService, useValue: mockState },
        { provide: Router, useValue: { routerState: { snapshot: { url: 'www.crossroads.net' } } } },
        { provide: LoginRedirectService, useValue: mockLoginRedirectService }
      ]
    });
  });

  it('should create an instance', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));

  it('should indicate all groups are online', inject([SearchService], (service: SearchService) => {
    pins[0].gathering.isVirtualGroup = true;
    pins[1].gathering.isVirtualGroup = true;
    pins[2].gathering.isVirtualGroup = false;
    let areAllGroupsOnlineExpected: boolean = false;
    let areAllGroupsOnlineActual: boolean = service.areAllReturnedGroupsOnlineGroups(pins);

    expect(areAllGroupsOnlineExpected).toEqual(areAllGroupsOnlineActual);
  }));

  it('should indicate NOT all groups are online', inject([SearchService], (service: SearchService) => {
    pins[0].gathering.isVirtualGroup = true;
    pins[1].gathering.isVirtualGroup = true;
    pins[2].gathering.isVirtualGroup = true;
    let areAllGroupsOnlineExpected: boolean = true;
    let areAllGroupsOnlineActual: boolean = service.areAllReturnedGroupsOnlineGroups(pins);

    expect(areAllGroupsOnlineExpected).toEqual(areAllGroupsOnlineActual);
  }));

  it('should navigate away', inject([SearchService], (service: SearchService) => {
    pins[0].gathering.isVirtualGroup = true;
    pins[1].gathering.isVirtualGroup = true;
    pins[2].gathering.isVirtualGroup = true;

    (mockAppSettingsService.isSmallGroupApp).and.returnValue(true);

    service.navigateToListViewIfInGroupToolAndAllGroupsOnline(pins);
    expect(mockState.setCurrentView).toHaveBeenCalledWith(ViewType.LIST);
  }));

});
