import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router,  ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { SessionService } from '../../../../services/session.service';
import { StateService } from '../../../../services/state.service';
import { ParticipantService } from '../../../../services/participant.service';

import { MockComponent } from '../../../../shared/mock.component';

import { EndGroupConfirmationComponent } from './end-group-confirmation.component';

let fixture: ComponentFixture<EndGroupConfirmationComponent>;
let comp: EndGroupConfirmationComponent;
let mockRouter, mockSessionService, mockState, mockToastsManager, mockContentService,
  mockParticipantService;

describe('end-group-confirmation.component', () => {
  beforeEach(() => {
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['get', 'post', 'getContactId']);
    mockState = jasmine.createSpyObj<StateService>('state', ['setLoading']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    mockToastsManager = jasmine.createSpyObj<ToastsManager>('toast', ['error', 'success']);
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);
    mockParticipantService = jasmine.createSpyObj<ParticipantService>('participant', ['clearGroupFromCache']);

    TestBed.configureTestingModule({
      declarations: [
        EndGroupConfirmationComponent,
      ],
      imports: [],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: StateService, useValue: mockState },
        { provide: Router, useValue: mockRouter},
        { provide: ActivatedRoute, useValue: { snapshot: { params: { groupId: 1234 } } } },
        { provide: ToastsManager, useValue: mockToastsManager },
        { provide: ContentService, useValue: mockContentService },
        { provide: ParticipantService, useValue: mockParticipantService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(EndGroupConfirmationComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should create an instance', () => {
      expect(comp).toBeTruthy();
  });

  it('ends the group', () => {
    const groupId = '1234';
    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.of(true));

    comp.ngOnInit();
    comp.onEndGroup();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/my']);
    expect(mockToastsManager.success).toHaveBeenCalled();
    expect(mockContentService.getContent).toHaveBeenCalledWith('endGroupConfirmationSuccessMessage');
  });

  it('handles HTTP errors', () => {
    <jasmine.Spy>(mockSessionService.post).and.returnValue(Observable.throw({status: 400}));

    comp.ngOnInit();
    comp.onEndGroup();
    expect(mockToastsManager.error).toHaveBeenCalled();
    expect(mockContentService.getContent).toHaveBeenCalledWith('endGroupConfirmationFailureMessage');
  });
});
