import { MockComponent } from '../../shared/mock.component';
import { StateService } from '../../services/state.service';
import { Router, ActivatedRoute } from '@angular/router';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { StuffNotFoundComponent } from './stuff-not-found.component';
import { AppSettingsService } from '../../services/app-settings.service';
import { ParticipantService } from '../../services/participant.service';
import { PinService } from '../../services/pin.service';
import { GroupResourcesUrl, GroupLeaderApplicationStatus } from '../../shared/constants';

describe('StuffNotFoundComponent', () => {
  let fixture: ComponentFixture<StuffNotFoundComponent>;
  let comp: StuffNotFoundComponent;
  let mockStateService;
  let mockAppSettingsService;
  let mockParticipantService;
  let mockPinService;
  let mockRouter;

  beforeEach(() => {
    mockStateService = jasmine.createSpyObj('state', ['setLoading', 'setPageHeader']);
    mockAppSettingsService = jasmine.createSpyObj('appSettings', ['myStuffName']);
    mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantService', ['getLeaderStatus']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['clearPinCache']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [StuffNotFoundComponent, MockComponent({ selector: 'crds-content-block', inputs: ['id'] })],
      providers: [
        { provide: StateService, useValue: mockStateService },
        { provide: AppSettingsService, useValue: mockAppSettingsService },
        { provide: ParticipantService, useValue: mockParticipantService },
        { provide: PinService, useValue: mockPinService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(
    async(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(StuffNotFoundComponent);
        comp = fixture.componentInstance;
      });
    })
  );

  it('should create an instance', () => {
    expect(comp).toBeTruthy();
  });

  it('should search', () => {
    comp.onFindAGroupClicked();
    expect(mockPinService.clearPinCache).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
