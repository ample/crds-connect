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
import { ParticipantCardComponent } from '../../participants-list/participant-card/participant-card.component';
import { ParticipantsListComponent } from '../../participants-list/participants-list.component';
import { Participant } from '../../../../models/participant';
import { Inquiry } from '../../../../models/inquiry';
import { PinDetailsComponent } from '../../pin-details.component';
import { PinHeaderComponent } from '../../pin-header/pin-header.component';
import { SayHiComponent } from '../../say-hi/say-hi.component';
import { ReadonlyAddressComponent } from '../../readonly-address/readonly-address.component';
import { PinLoginActionsComponent } from '../../pin-login-actions/pin-login-actions.component';
import { PersonComponent } from '../../person/person.component';
import { GroupService } from '../../../../services/group.service';
import { StateService } from '../../../../services/state.service';
import { Observable } from 'rxjs/Rx';


describe('Component: Gathering Requests Component', () => {

  let component;
  let fixture;
  let pin;

  describe('Pending Requests To Join', () => {
    beforeEach(() => {
     this.pin = {
        'firstName': 'Joe',
        'lastName': 'Kerstanoff',
        'emailAddress': 'jkerstanoff@callibrity.com',
        'contactId': 2562378,
        'participantId': 7537153,
        'address': {
          'addressId': 5272699,
          'addressLine1': '8854 Penfield Way',
          'addressLine2': null,
          'city': 'Maineville',
          'state': 'OH',
          'zip': '45039-9731',
          'foreignCountry': 'United States',
          'county': null,
          'longitude': null,
          'latitude': null
        },
        'hostStatus': 0,
        'gathering': {
            'groupId': 3,
            'contactId': 2562378
        }
      };
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
          SayHiComponent
        ],
        imports: [ ReactiveFormsModule, HttpModule, JsonpModule ],
        providers: [
          SessionService,
          CookieService,
          Angulartics2,
          GroupService,
          StateService
        ]
      });
      this.fixture = TestBed.createComponent(GatheringRequestsComponent);
      this.component = this.fixture.componentInstance;
      this.component.pin = this.pin;
    });

    it('should create an instance', () => {
      expect(this.component).toBeTruthy();
    });

    it('should init', inject([GroupService], (group) => {
      spyOn(group, 'getGroupRequests').and.returnValue(Observable.of([{inquiryId: 1}, {inquiryId: 2}]));
      this.component.ngOnInit();
      expect(this.component.inquiries.length).toBe(2);
      expect(group.getGroupRequests.calls.count()).toBe(1);
    }));

    it('should convert inquiry to participant', () => {
        let inquiry = new Inquiry(1, 'theemail@email.com', null, 'Joe', 'Ker', new Date(2002), false, 42, 1, null);
        let participant = this.component.convertToParticipant(inquiry);
        expect(participant.contactId).toBe(1);
        expect(participant.lastName).toBe('Ker');
        expect(participant.nickName).toBe('Joe');
    });

});
});



