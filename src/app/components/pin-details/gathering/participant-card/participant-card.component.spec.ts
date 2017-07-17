import { ActivatedRoute, Router } from '@angular/router';
/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

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
  let mockRoute: ActivatedRouteStub;

  beforeEach(() => {
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    mockRoute = new ActivatedRouteStub();
    participant = new Participant('Mason', 321, 'Kerstanoff, Joeker', 'email@email.com', 111, 22, 'Leader', true, 'Kerstanoff',
      'JoeKer', 123, '1943-02-03');

    TestBed.configureTestingModule({
      declarations: [
        ParticipantCardComponent,
        MockComponent({ selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass'] }),
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute}
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
    comp.canBeHyperlinked = true;
    comp.ngOnInit();
    expect(comp['isMe']).toBe(true);
    expect(comp.canBeHyperlinked).toBe(false);
  });

  it('should init and set isMe to false', () => {
    mockSessionService.getContactId.and.returnValue(747648367);
    comp.canBeHyperlinked = true;
    comp.ngOnInit();
    expect(comp['isMe']).toBe(false);
    expect(comp.canBeHyperlinked).toBe(true);
  });

  it('showHostLabel should return true when pinParticipant id matches the participants id', () => {
    comp.pinParticipantId = 777;
    comp.participant.participantId = 777;
    expect(comp.showHostLabel()).toBe(true);
  });

  it('showHostLabel should return false when pinParticipant doesnt match participant', () => {
    expect(comp.showHostLabel()).toBe(false);
  });

  it('should navigate on card click', () => {
    comp.pinParticipantId = 777;
    comp.participant.participantId = 777;
    comp.participant.groupParticipantId = 777;
    comp.canBeHyperlinked = true;

    comp.onParticipantClick();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['./participant-detail/' + 777], { relativeTo: mockRoute });
  });

  it('should not navigate on card click ', () => {
    comp.pinParticipantId = 777;
    comp.participant.participantId = 777;
    comp.participant.groupParticipantId = 777;
    comp.canBeHyperlinked = false;

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
