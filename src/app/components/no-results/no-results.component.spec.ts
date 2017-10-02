/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';

import { ContentBlockModule } from 'crds-ng2-content-block';
import { ContentService } from 'crds-ng2-content-block';
import { StateService } from '../../services/state.service';
import { AppSettingsService } from '../../services/app-settings.service';
import { NoResultsComponent } from './no-results.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../shared/mock.component';

describe('Component: NoResults', () => {
  let mockContentService,
      mockStateService,
      mockAppSettingsService,
      mockRouter;

  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData']);
    mockStateService = jasmine.createSpyObj<StateService>('state', ['']);
    mockAppSettingsService = jasmine.createSpyObj('appSettings', ['myStuffName']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [
        NoResultsComponent,
        MockComponent({selector: 'crds-content-block', inputs: ['id']})
      ],
      imports: [ HttpModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: StateService, useValue: mockStateService },
        { provide: ContentService, useValue: mockContentService },
        { provide: AppSettingsService, useValue: mockAppSettingsService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    this.fixture = TestBed.createComponent(NoResultsComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
      expect(this.component).toBeTruthy();
  });

  it('should navigate to neighbors on button click', () => {
      this.component.btnClickBack();
      expect(this.component.router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should navigate to add me to map on button click', () => {
      this.component.btnClickAddToMap();
      expect(this.component.router.navigateByUrl).toHaveBeenCalledWith('/add-me-to-the-map');
  });

});
