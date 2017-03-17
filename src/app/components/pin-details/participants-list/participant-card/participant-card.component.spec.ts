/* tslint:disable:no-unused-variable */
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../../../../services/session.service';
import { HttpModule, JsonpModule } from '@angular/http';

import { AddressFormComponent } from '../../../address-form/address-form.component';
import { GatheringComponent } from '../../gathering/gathering.component';
import { GatheringRequestsComponent } from '../../gathering/gathering-requests/gathering-requests.component';
import { ParticipantCardComponent } from './participant-card.component';
import { ParticipantsListComponent } from '../participants-list.component';
import { Participant } from '../../../../models/participant';
import { PinDetailsComponent } from '../../pin-details.component';
import { PinHeaderComponent } from '../../pin-header/pin-header.component';
import { SayHiComponent } from '../../say-hi/say-hi.component';
import { ReadonlyAddressComponent } from '../../readonly-address/readonly-address.component';
import { PinLoginActionsComponent } from '../../pin-login-actions/pin-login-actions.component';
import { InviteSomeoneComponent } from '../../gathering/invite-someone/invite-someone.component';
import { PersonComponent } from '../../person/person.component';
import { ContentBlockModule } from 'crds-ng2-content-block';


describe('Component: Participant Card component', () => {

  let component;
  let fixture;
  let pinParticipantId;
  let participant;

  describe('Participant Card', () => {
    beforeEach(() => {
      participant = new Participant('Mason', 321, 'Kerstanoff, Joeker', 'email@email.com', 111, 22, 'Leader', true, 'Kerstanoff', 'JoeKer', 123, '1943-02-03');
      TestBed.configureTestingModule({
        declarations: [
          AddressFormComponent,
          GatheringComponent,
          GatheringRequestsComponent,
          ParticipantCardComponent,
          ParticipantsListComponent,
          PersonComponent,
          PinDetailsComponent,
          PinHeaderComponent,
          PinLoginActionsComponent,
          ReadonlyAddressComponent,
          SayHiComponent,
          InviteSomeoneComponent
        ],
        imports: [ ReactiveFormsModule, HttpModule, JsonpModule, ContentBlockModule.forRoot({ categories: ['common'] }) ],
        providers: [
          SessionService,
          CookieService,
          Angulartics2
        ]
      });
      this.fixture = TestBed.createComponent(ParticipantCardComponent);
      this.component = this.fixture.componentInstance;
      this.component.participant = participant;
      this.component.pinParticipantId = 777;
    });

    it('should create an instance', () => {
      expect(this.component).toBeTruthy();
    });

    it('showHostLabel should return true when pinParticipant id matches the participants id', () => {
      this.component.participant.participantId = 777;
      expect(this.component.showHostLabel()).toBe(true);
    });

    it('showHostLabel should return false when pinParticipant doesnt match participant', () => {
      expect(this.component.showHostLabel()).toBe(false);
    });

    it('showMeLabel() should return true when participant.contactId matches logged in users', inject([SessionService], (session) => {
      spyOn(session, 'getContactId').and.returnValue(321);
      expect(this.component.showMeLabel()).toBe(true);
    }));

    it('showMeLabel() should return false when participant.contactId doesnt match logged in users', inject([SessionService], (session) => {
      spyOn(session, 'getContactId').and.returnValue(747648367);
      expect(this.component.showMeLabel()).toBe(false);
    }));


});
});
