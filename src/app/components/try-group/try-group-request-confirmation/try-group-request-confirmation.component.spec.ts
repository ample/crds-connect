import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../../shared/mock.component';
import { Observable } from 'rxjs/Rx';
import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';

import {TryGroupRequestConfirmationComponent} from './try-group-request-confirmation.component';


let fixture: ComponentFixture<TryGroupRequestConfirmationComponent>;
let comp: TryGroupRequestConfirmationComponent;
let mockRouter, mockSessionService, mockState;
let route;

describe('try-group-request-confirmation.component', () => {
  beforeEach(() => {

    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['get', 'post', 'getContactId']);
    mockState = jasmine.createSpyObj<StateService>('state', ['setLoading']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    /* mockRouter = {
      url: '/small-group/1234', routerState:
      { snapshot: { url: '/small-group/1234' } }, navigate: jasmine.createSpy('navigate') 
    };*/

    TestBed.configureTestingModule({
      declarations: [
        TryGroupRequestConfirmationComponent,
      ],
      imports: [],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: StateService, useValue: mockState },
        { provide: Router, useValue: mockRouter},
        { provide: ActivatedRoute, useValue: { snapshot: { params: { groupId: 1234 } } } },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TryGroupRequestConfirmationComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should create an instance', () => {
      expect(comp).toBeTruthy();
  });

  it('Submits', () => {
    const groupId = 1234;

    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));

    comp.ngOnInit();
    comp.onSubmit();
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/try-group-request-success/${groupId}`]);
  });

  it('Handles submission errors - 409', () => {
    const groupId = 1234;

    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.throw({status: 409}));

    comp.ngOnInit();
    comp.onSubmit();
    expect(comp['errorMessage']).toBe('tryGroupRequestAlreadyRequestedFailureMessage');
  });

  it('Handles submission errors - other', () => {
    const groupId = 1234;

    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.throw({status: 404}));

    comp.ngOnInit();
    comp.onSubmit();
    expect(comp['errorMessage']).toBe('tryGroupRequestGeneralFailureMessage');
  });
});
