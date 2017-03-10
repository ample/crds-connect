/* tslint:disable:no-unused-variable */
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../../../../services/session.service';
import { GatheringComponent } from '../../gathering/gathering.component';
import { ParticipantCardComponent } from './participant-card.component';
import { ParticipantsListComponent } from '../participants-list.component';
import { Participant } from '../../../../models/participant';


describe('Component: Participant Card component', () => {

  let component;
  let fixture;
  let pinParticipantId;
  let participant;

  describe('Participant Card', () => {
    beforeEach(() => {
      participant = new Participant();
      participant.participantId = 123;
      participant.contactId = 321;     
      TestBed.configureTestingModule({
        declarations: [
          GatheringComponent,
          ParticipantCardComponent,
          ParticipantsListComponent
        ],
        imports: [],
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



