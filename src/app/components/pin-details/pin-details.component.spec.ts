/* tslint:disable:no-unused-variable */
import { Angulartics2 } from 'angulartics2';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ContentService } from '../../services/content.service';
import { IFrameParentService } from '../../services/iframe-parent.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { BlandPageService } from '../../services/bland-page.service';
import { PinService } from '../../services/pin.service';
import { Observable } from 'rxjs/Rx';
import { AddressFormComponent } from '../address-form/address-form.component';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { LocationService } from '../../services/location.service';
import { GatheringComponent } from '../pin-details/gathering/gathering.component';
import { GatheringRequestsComponent } from '../pin-details/gathering/gathering-requests/gathering-requests.component';
import { PersonComponent } from '../pin-details/person/person.component';
import { PinHeaderComponent } from '../pin-details/pin-header/pin-header.component';
import { PinLoginActionsComponent } from '../pin-details/pin-login-actions/pin-login-actions.component';
import { ParticipantsListComponent } from '../pin-details/participants-list/participants-list.component';
import { ParticipantCardComponent } from '../pin-details/participants-list/participant-card/participant-card.component';
import { ReadonlyAddressComponent } from '../pin-details/readonly-address/readonly-address.component';
import { SayHiComponent } from '../pin-details/say-hi/say-hi.component';
import { InviteSomeoneComponent } from './gathering/invite-someone/invite-someone.component';


import { PinDetailsComponent } from './pin-details.component';
import { ContentBlockModule } from 'crds-ng2-content-block';

import { pinType } from '../../models/pin';

import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';

describe('Component: Pin-Details component', () => {

  let component;
  let fixture;
  let pin;

  describe('non gathering', () => {
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
        'gathering': null,
        'pinType': pinType.PERSON
      };
      TestBed.configureTestingModule({
        declarations: [
          AddressFormComponent,
          PinHeaderComponent,
          PinLoginActionsComponent,
          ReadonlyAddressComponent,
          SayHiComponent,
          ParticipantsListComponent,
          ParticipantCardComponent,
          PersonComponent,
          GatheringComponent,
          GatheringRequestsComponent,
          PinDetailsComponent,
          InviteSomeoneComponent
        ],
        imports: [
          RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule,
          ContentBlockModule.forRoot({ categories: ['common'] })
        ],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { data: { pin: this.pin } } },
          },
          IFrameParentService,
          StoreService,
          StateService,
          SessionService,
          CookieService,
          PinService,
          Angulartics2,
          LoginRedirectService,
          AddMeToTheMapHelperService,
          LocationService,
          BlandPageService
        ]
      });
      this.fixture = TestBed.createComponent(PinDetailsComponent);
      this.component = this.fixture.componentInstance;

    });

    it('should create an instance', () => {
      expect(this.component).toBeTruthy();
    });

    it('doesLoggedInUserOwnPin() should return true if contactId matches', inject([SessionService], (service: any) => {
      spyOn(service, 'getContactId').and.returnValue(2562378);
      this.component.ngOnInit();
      let returnValue = this.component.doesLoggedInUserOwnPin();
      expect(returnValue).toBe(true);

    }));

    it('doesLoggedInUserOwnPin() should return false if contactId doesn\'t match', inject([SessionService], (service: any) => {
      spyOn(service, 'getContactId').and.returnValue(42);
      this.component.ngOnInit();
      let returnValue = this.component.doesLoggedInUserOwnPin();
      expect(returnValue).toBe(false);
    }));

    it('shouldInit while not logged in', inject([SessionService], (session) => {
      spyOn(session, 'isLoggedIn').and.returnValue(false);
      this.component.ngOnInit();
      expect(this.component.isLoggedIn).toBe(false);
      expect(this.component.pin.firstName).toBe('Joe');
      expect(session.isLoggedIn.calls.count()).toEqual(1);
      expect(this.component.isPinOwner).toBe(false);
    }));

    it('shouldInit while logged in', inject([SessionService], (session) => {
      spyOn(session, 'isLoggedIn').and.returnValue(true);
      expect(this.component.isGatheringPin).toBe(false);
      this.component.ngOnInit();
      expect(this.component.isLoggedIn).toBe(true);
    }));
  });

  describe('gathering', () => {
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
        'pinType': pinType.GATHERING,
        'gathering': {
          'Participants': [
            {
              'congregation': 'Anywhere',
              'contactId': 7673621,
              'displayName': 'Shannon, Doug',
              'email': 'dshannon@callibrity.com',
              'groupParticipantId': 14629582,
              'groupRoleId': 22,
              'groupRoleTitle': 'Leader',
              'isApprovedLeader': true,
              'lastName': 'Shannon',
              'nickName': 'Doug',
              'participantId': 7565308,
              'startDate': '2017-02-14T00:00:00'
            }
          ],
          'address': {
            'addressId': 5272699,
            'addressLine1': '403 sudbury dr',
            'addressLine2': null,
            'city': 'trenton',
            'state': 'OH',
            'zip': '45067',
            'foreignCountry': 'United States',
            'county': null,
            'longitude': null,
            'latitude': null
          },
          'availableOnline': true,
          'childCareInd': false,
          'congregationId': 15,
          'contactName': 'Shannon, Doug',
          'groupDescription': 'this is a description.  it may not be the best description but it is mine.',
          'groupFullInd': false,
          'groupId': 178163,
          'groupName': 'Dougs Anywhere Group',
          'groupRoleId': 22,
          'groupTypeId': 30,
          'groupTypeName': 'Anywhere Gathering',
          'ministryId': 8,
          'primaryContactEmail': 'dshannon@callibrity.com',
          'startDate': '2017-02-01T00:00:00',
        }
      };
      TestBed.configureTestingModule({
        declarations: [
          AddressFormComponent,
          PinHeaderComponent,
          PinLoginActionsComponent,
          ReadonlyAddressComponent,
          SayHiComponent,
          PersonComponent,
          ParticipantCardComponent,
          ParticipantsListComponent,
          GatheringComponent,
          GatheringRequestsComponent,
          PinDetailsComponent,
          InviteSomeoneComponent
        ],
        imports: [
          RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule,
          ContentBlockModule.forRoot({ categories: ['common'] })
        ],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { data: { pin: this.pin } } },
          },
          IFrameParentService,
          StoreService,
          StateService,
          SessionService,
          CookieService,
          PinService,
          Angulartics2,
          LoginRedirectService,
          AddMeToTheMapHelperService,
          LocationService,
          BlandPageService
        ]
      });
      this.fixture = TestBed.createComponent(PinDetailsComponent);
      this.component = this.fixture.componentInstance;

    });

    it('should create an instance', () => {
      expect(this.component).toBeTruthy();
    });

    it('doesLoggedInUserOwnPin() should return true if contactId matches', inject([SessionService], (service: any) => {
      spyOn(service, 'getContactId').and.returnValue(2562378);
      this.component.ngOnInit();
      let returnValue = this.component.doesLoggedInUserOwnPin();
      expect(returnValue).toBe(true);

    }));

    it('doesLoggedInUserOwnPin() should return false if contactId doesn\'t match', inject([SessionService], (service: any) => {
      spyOn(service, 'getContactId').and.returnValue(42);
      this.component.ngOnInit();
      let returnValue = this.component.doesLoggedInUserOwnPin();
      expect(returnValue).toBe(false);
    }));

    it('shouldInit while not logged in', inject([SessionService], (session) => {
      spyOn(session, 'isLoggedIn').and.returnValue(false);
      this.component.ngOnInit();
      expect(this.component.isLoggedIn).toBe(false);
      expect(this.component.isGatheringPin).toBe(true);
      expect(this.component.pin.firstName).toBe('Joe');
      expect(session.isLoggedIn.calls.count()).toEqual(1);
      expect(this.component.isPinOwner).toBe(false);
    }));
  });
});



