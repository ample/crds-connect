import { ActivatedRoute, Router } from '@angular/router';
/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppSettingsService } from '../../../../services/app-settings.service';
import { SessionService } from '../../../../services/session.service';
import { ParticipantCardComponent } from './participant-card.component';
import { MockComponent } from '../../../../shared/mock.component';
import { Participant } from '../../../../models/participant';

class ActivatedRouteStub {
    url = '/small-group/1234';
}

describe('ParticipantCardComponent', () => {
  let fixture: ComponentFixture<ParticipantCardComponent>;
  let comp: ParticipantCardComponent;
  let el;
  let participant;
  let mockSessionService, mockRouter;
  let mockAppSettings;
  let mockRoute: ActivatedRouteStub;

  beforeEach(() => {
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId']);
    mockAppSettings = jasmine.createSpyObj<AppSettingsService>('appSettingsService', ['isSmallGroupApp','isConnectApp']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    mockRoute = new ActivatedRouteStub();
    let canBeHyperlinked: boolean = true;
    participant = new Participant('Mason', 321, 'Kerstanoff, Joeker', 'email@email.com', 111, 22, 'Leader', true, 'Kerstanoff',
      'JoeKer', 123, '1943-02-03', canBeHyperlinked);

    TestBed.configureTestingModule({
      declarations: [
        ParticipantCardComponent,
        MockComponent({ selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass'] }),
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute},
        { provide: AppSettingsService, useValue: mockAppSettings}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ParticipantCardComponent);
      comp = fixture.componentInstance;
      comp.participant = participant;
      // el = fixture.debugElement.query(By.css('h1'));
    });
  }));

  it('should create an instance', () => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should init and set isMe to true', () => {
    mockSessionService.getContactId.and.returnValue(321);
    comp['participant'].canBeHyperlinked = true;
    comp.ngOnInit();
    expect(comp['isMe']).toBe(true);
    expect(comp['participant'].canBeHyperlinked).toBe(false);
  });

  it('should init and set isMe to false', () => {
    mockSessionService.getContactId.and.returnValue(747648367);
    comp['participant'].canBeHyperlinked = true;
    comp.ngOnInit();
    expect(comp['isMe']).toBe(false);
    expect(comp['participant'].canBeHyperlinked).toBe(true);
  });

  it('showLeaderLabel should return true', () => {
    mockAppSettings.isSmallGroupApp.and.returnValue(true);
    comp.isLeader = true;
    expect(comp.showLeaderLabel()).toBe(true);
  });

  it('showApprenticeLabel should return true', () => {
    mockAppSettings.isSmallGroupApp.and.returnValue(true);
    comp.isApprentice = true;
    expect(comp.showApprenticeLabel()).toBe(true);
  });

  it('showTrialMemberLabel should return true', () => {
    mockAppSettings.isSmallGroupApp.and.returnValue(true);
    comp.isTrialMember = true;
    expect(comp.showTrialMemberLabel()).toBe(true);
  });

  it('showTrialMemberLabel should return false', () => {
    mockAppSettings.isSmallGroupApp.and.returnValue(true);
    comp.isTrialMember = false;
    expect(comp.showTrialMemberLabel()).toBe(false);
  });

  it('showLeader should return true when pinParticipant id matches the participants id', () => {
    comp.pinParticipantId = 777;
    comp.participant.participantId = 777;
    mockAppSettings.isConnectApp.and.returnValue(true);
    expect(comp.showLeaderLabel()).toBe(true);
  });

  it('showLeaderLabel should return false when pinParticipant doesnt match participant', () => {
    expect(comp.showLeaderLabel()).toBe(false);
  });

  it('should navigate on card click', () => {
    comp.pinParticipantId = 777;
    comp.participant.participantId = 777;
    comp.participant.groupParticipantId = 777;
    comp['participant'].canBeHyperlinked = true;

    comp.onParticipantClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['./participant-detail/' + 777], { relativeTo: mockRoute });
  });

  it('should not navigate on card click ', () => {
    comp.pinParticipantId = 777;
    comp.participant.participantId = 777;
    comp.participant.groupParticipantId = 777;
    comp['participant'].canBeHyperlinked = false;

    comp.onParticipantClick();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate on remove self participant ', () => {
    comp.pinParticipantId = 777;
    comp.participant.participantId = 777;
    comp.participant.groupParticipantId = 777;
    comp.isMe = true;
    comp.isLeader = false;

    comp.onRemoveParticipant();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should not navigate on remove self participant ', () => {
    comp.pinParticipantId = 777;
    comp.participant.participantId = 777;
    comp.participant.groupParticipantId = 777;
    comp.isMe = true;
    comp.isLeader = true;

    comp.onRemoveParticipant();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

});
