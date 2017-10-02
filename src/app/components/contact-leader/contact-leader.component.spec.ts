import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { MsgToLeader } from '../../models/msg-to-leader';
import { BlandPageService } from '../../services/bland-page.service';
import { ParticipantService } from '../../services/participant.service';
import { StateService } from '../../services/state.service';
import { MockComponent } from '../../shared/mock.component';
import { ContactLeaderComponent } from './contact-leader.component';

describe('ContactLeaderComponent', () => {
    let fixture: ComponentFixture<ContactLeaderComponent>;
    let comp: ContactLeaderComponent;
    let el;
    let mockBlandPageService,
        mockContentService,
        mockStateService,
        mockLocation,
        mockParticipantService,
        mockRouter,
        mockToastsManager;
    let groupId = '42';

    beforeEach(() => {
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('BlandPageService', ['navigateToMessageSentToLeaderConfirmation']);
        mockContentService = jasmine.createSpyObj<ContentService>('contentService', ['getContent']);
        mockLocation = jasmine.createSpyObj<Location>('location', ['back']);
        mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantService', ['submitLeaderMessageToAPI']);
        mockStateService = jasmine.createSpyObj<StateService>('stateService', ['setLoading']);
        mockToastsManager = jasmine.createSpyObj<ToastsManager>('toastsManager', ['error']);

        TestBed.configureTestingModule({
            declarations: [
                ContactLeaderComponent,
                MockComponent({selector: 'crds-content-block', inputs: ['id']})
            ],
            imports: [RouterTestingModule.withRoutes([])],
            providers: [
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: ContentService, useValue: mockContentService },
                { provide: Location, useValue: mockLocation },
                { provide: ParticipantService, useValue: mockParticipantService },
                { provide: ActivatedRoute, useValue: { params: Observable.from([{ groupId: groupId }]) } },
                { provide: ToastsManager, useValue: mockToastsManager },
                { provide: StateService, useValue: mockStateService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ContactLeaderComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should create an instance', () => {
      expect(comp).toBeTruthy();
    });

    it('should init', () => {
        comp.ngOnInit();
        expect(comp.contactLeaderForm).not.toBeUndefined();
        expect(comp.groupId).toBe(+groupId);
        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    });

    it('should send message to leader', () => {
      let mockMsgToLeader: MsgToLeader = new MsgToLeader('lol', 'rofl');
      (mockParticipantService.submitLeaderMessageToAPI).and.returnValue(Observable.of({}));
      comp.groupId = 2;
      comp['sendLeaderMessage'](mockMsgToLeader);
      expect(mockParticipantService.submitLeaderMessageToAPI).toHaveBeenCalledWith(2, mockMsgToLeader);
      expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if it fails to send a message to the leader', () => {
      let mockMsgToLeader: MsgToLeader = new MsgToLeader('lol', 'rofl');
      (mockParticipantService.submitLeaderMessageToAPI).and.returnValue(Observable.throw({}));
      (mockContentService.getContent).and.returnValue('whee');
      comp.groupId = 2;
      comp['sendLeaderMessage'](mockMsgToLeader);
      expect(mockParticipantService.submitLeaderMessageToAPI).toHaveBeenCalledWith(2, mockMsgToLeader);
      expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
      expect(mockContentService.getContent).toHaveBeenCalledWith('groupFinderContactCrdsError');
      expect(mockToastsManager.error).toHaveBeenCalledWith('whee', null);
    });

    it('should close fauxdal', () => {
      spyOn(comp['location'], 'back');
      comp['closeClick']();
      expect(comp['location'].back).toHaveBeenCalled();
    });
});
