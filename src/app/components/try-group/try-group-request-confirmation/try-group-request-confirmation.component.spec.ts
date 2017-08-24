import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';

import { SessionService } from '../../../services/session.service';
import { StateService } from '../../../services/state.service';

import { MockComponent } from '../../../shared/mock.component';

import {TryGroupRequestConfirmationComponent} from './try-group-request-confirmation.component';

let fixture: ComponentFixture<TryGroupRequestConfirmationComponent>;
let comp: TryGroupRequestConfirmationComponent;
let mockRouter, mockSessionService, mockState, mockToastsManager, mockContentService;

describe('try-group-request-confirmation.component', () => {
  beforeEach(() => {
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['get', 'post', 'getContactId']);
    mockState = jasmine.createSpyObj<StateService>('state', ['setLoading']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    mockToastsManager = jasmine.createSpyObj<ToastsManager>('toast', ['error', 'success']);
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);

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
        { provide: ToastsManager, useValue: mockToastsManager },
        { provide: ContentService, useValue: mockContentService}
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
    const groupId = '1234';
    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));

    comp.ngOnInit();
    comp.onSubmit();
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/small-group/${groupId}`]);
    expect(mockToastsManager.success).toHaveBeenCalled();
    expect(mockContentService.getContent).toHaveBeenCalledWith('tryGroupRequestSuccess');
  });

  it('Handles submission errors - 409', () => {
    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.throw({status: 409}));

    comp.ngOnInit();
    comp.onSubmit();
    expect(mockToastsManager.error).toHaveBeenCalled();
    expect(mockContentService.getContent).toHaveBeenCalledWith('tryGroupRequestAlreadyRequestedFailureMessage');
  });

  it('Handles submission errors - other', () => {
    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.throw({status: 404}));

    comp.ngOnInit();
    comp.onSubmit();
    expect(mockToastsManager.error).toHaveBeenCalled();
    expect(mockContentService.getContent).toHaveBeenCalledWith('tryGroupRequestGeneralFailureMessage');
  });
});
