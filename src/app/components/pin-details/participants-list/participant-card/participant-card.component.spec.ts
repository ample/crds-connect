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
import { ParticipantCardComponent } from './participant-card.component';
import { ParticipantsListComponent } from '../participants-list.component';
import { Participant } from '../../../../models/participant';
import { PinDetailsComponent } from '../../pin-details.component';
import { PinHeaderComponent } from '../../pin-header/pin-header.component';
import { SayHiComponent } from '../../say-hi/say-hi.component';
import { ReadonlyAddressComponent } from '../../readonly-address/readonly-address.component';
import { PinLoginActionsComponent } from '../../pin-login-actions/pin-login-actions.component';
import { PersonComponent } from '../../person/person.component';


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
          ParticipantCardComponent,
          ParticipantsListComponent,
          PersonComponent,
          PinDetailsComponent,
          PinHeaderComponent,
          PinLoginActionsComponent,
          ReadonlyAddressComponent,
          SayHiComponent
        ],
        imports: [ ReactiveFormsModule, HttpModule, JsonpModule ],
        providers: [
          SessionService,
          CookieService,
          Angulartics2
        ]
      });
      this.fixture = TestBed.createComponent(ParticipantCardComponent);
      this.component = this.fixture.componentInstance;
      this.component.participant = participant;
    });

    it('should create an instance', () => {
      expect(this.component).toBeTruthy();
    });
});
});



