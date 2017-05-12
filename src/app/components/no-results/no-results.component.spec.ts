/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';

import { StateService } from '../../services/state.service';
import { NoResultsComponent } from './no-results.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../shared/mock.component';

describe('Component: NoResults', () => {
  let mockStateService,
      mockRouter;

  beforeEach(() => {
    mockStateService = { setPageHeader: jest.fn() };
    mockRouter = { navigateByUrl: jest.fn() };

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

  it('should init()', () => {
    this.component.ngOnInit();
    expect(mockStateService.setPageHeader).toHaveBeenCalledWith('No Results', '/');
    expect(this.component['groupUrl']).toBe('//int.crossroads.net/groups/search');
  });

  it('should navigate to become a host', () => {
    this.component.btnClickBecomeHost();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/host-signup');
  });

  it('should open a new window for groups', () => {
    jest.spyOn(window, 'open').mockReturnValue(true);
    this.component.groupUrl = 'abc123';
    this.component.btnClickFindOnlineGroup();
    expect(window.open).toHaveBeenCalledWith(this.component.groupUrl);
  });

});
