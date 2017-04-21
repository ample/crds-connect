/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { SessionService } from '../../../../services/session.service';
import { ParticipantCardComponent } from './participant-card.component';
import { MockComponent } from '../../../../shared/mock.component';
import { Participant } from '../../../../models/participant';

describe('ParticipantCardComponent', () => {
  let fixture: ComponentFixture<ParticipantCardComponent>;
  let comp: ParticipantCardComponent;
  let el;
  let participant;
  let mockSessionService;

  beforeEach(() => {
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId']);
    participant = new Participant('Mason', 321, 'Kerstanoff, Joeker', 'email@email.com', 111, 22, 'Leader', true, 'Kerstanoff',
      'JoeKer', 123, '1943-02-03');

    TestBed.configureTestingModule({
      declarations: [
        ParticipantCardComponent,
        MockComponent({ selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass'] }),
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService }
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

  it('showHostLabel should return true when pinParticipant id matches the participants id', () => {
    comp.pinParticipantId = 777;
    comp.participant.participantId = 777;
    expect(comp.showHostLabel()).toBe(true);
  });

  it('showHostLabel should return false when pinParticipant doesnt match participant', () => {
    expect(comp.showHostLabel()).toBe(false);
  });

  it('showMeLabel() should return true when participant.contactId matches logged in users', () => {
    mockSessionService.getContactId.and.returnValue(321);
    expect(comp.showMeLabel()).toBe(true);
  });

  it('showMeLabel() should return false when participant.contactId doesnt match logged in users', () => {
    mockSessionService.getContactId.and.returnValue(747648367);
    expect(comp.showMeLabel()).toBe(false);
  });
});