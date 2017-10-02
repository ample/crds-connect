/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';

import { ContentBlockModule } from 'crds-ng2-content-block';
import { ContentService } from 'crds-ng2-content-block';
import { StateService } from '../../../../services/state.service';
import { SessionService } from '../../../../services/session.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { ActivatedRoute } from '@angular/router';

import { PinService } from '../../../../services/pin.service';
import { RemovePersonPinComponent } from './remove-person-pin.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../../../shared/mock.component';
import { MockTestData } from '../../../../shared/MockTestData';

import { PinsShown, pinsShown } from '../../../../shared/constants'

describe('Component: NoResults', () => {
  let pin;
  let mockContentService,
    mockStateService,
    mockSessionService,
    mockRouter,
    mockPinService,
    mockActivatedRoute,
    mockBlandPageService;

  beforeEach(() => {
    pin = MockTestData.getAPin();

    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData']);
    mockStateService = jasmine.createSpyObj<StateService>('state', ['getCurrentView', 'setCurrentView']);
    mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['']);
    mockActivatedRoute = jasmine.createSpyObj<ActivatedRoute>('activatedRoute', ['']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['']);


    TestBed.configureTestingModule({
      declarations: [
        RemovePersonPinComponent,
        MockComponent({ selector: 'crds-content-block', inputs: ['id'] })
      ],
      imports: [HttpModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: StateService, useValue: mockStateService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: ContentService, useValue: mockContentService },
        { provide: PinService, useValue: mockPinService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { pin: pin } } },
        },
      ]
    });

    this.fixture = TestBed.createComponent(RemovePersonPinComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should return to the all results view if the app was previously there', () => {
    let mockCountOfItemsReturnedByLastSearch: number = 5;
    let mockState: string = pinsShown.EVERYONES_STUFF;
    let stateToReturnTo: string = this.component.determineStateToReturnTo(mockCountOfItemsReturnedByLastSearch, mockState);
    expect(stateToReturnTo).toEqual(pinsShown.EVERYONES_STUFF);
  });

  it('should return to the all results view if coming from my stuff but deleting user\'s last pin', () => {
    let mockCountOfItemsReturnedByLastSearch: number = 1;
    let mockState: string = pinsShown.MY_STUFF;
    let stateToReturnTo: string = this.component.determineStateToReturnTo(mockCountOfItemsReturnedByLastSearch, mockState);
    expect(stateToReturnTo).toEqual(pinsShown.EVERYONES_STUFF);
  });

  it('should return to my stuff if deleting own pin from my stuff but are associated with more pins', () => {
    let mockCountOfItemsReturnedByLastSearch: number = 5;
    let mockState: string = pinsShown.MY_STUFF;
    let stateToReturnTo: string = this.component.determineStateToReturnTo(mockCountOfItemsReturnedByLastSearch, mockState);
    expect(stateToReturnTo).toEqual(pinsShown.MY_STUFF);
  });

});
