/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';

import { ContentBlockModule } from 'crds-ng2-content-block';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { StateService } from '../../../../services/state.service';
import { SessionService } from '../../../../services/session.service';

import { PinService } from '../../../../services/pin.service';
import { RemovePersonPinComponent } from './remove-person-pin.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../../../shared/mock.component';

describe('Component: NoResults', () => {
  let mockContentService, 
      mockStateService, 
      mockSessionService,
      mockRouter,
      mockPinService;

  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData']);
    mockStateService = jasmine.createSpyObj<StateService>('state', ['']);
    mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['']);

    mockRouter = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['']);

    TestBed.configureTestingModule({
      declarations: [
        RemovePersonPinComponent,
        MockComponent({selector: 'crds-content-block', inputs: ['id']})
      ],
      imports: [ HttpModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: StateService, useValue: mockStateService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: ContentService, useValue: mockContentService },
        { provide: PinService, useValue: mockPinService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    this.fixture = TestBed.createComponent(RemovePersonPinComponent);
    this.component = this.fixture.componentInstance;
  });
 
  fit('should create an instance', () => { 
      expect(this.component).toBeTruthy();
  });

  // it('should navigate to neighbors on button click', () => {
  //     this.component.btnClickBack();
  //     expect(this.component.router.navigateByUrl).toHaveBeenCalledWith('/');
  // });

  // it('should navigate to add me to map on button click', () => {
  //     this.component.btnClickAddToMap();
  //     expect(this.component.router.navigateByUrl).toHaveBeenCalledWith('/add-me-to-the-map');
  // });

});
