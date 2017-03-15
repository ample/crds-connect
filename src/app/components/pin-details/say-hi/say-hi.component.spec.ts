import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SayHiComponent } from './say-hi.component';

import { PinService } from '../../../services/pin.service';
import { SessionService } from '../../../services/session.service';
import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StateService } from '../../../services/state.service';
import { HttpModule, JsonpModule } from '@angular/http';

/* tslint:disable:no-unused-variable */
import { Angulartics2 } from 'angulartics2';
import { ReactiveFormsModule } from '@angular/forms';

import { AddressFormComponent } from '../../address-form/address-form.component';
import { GatheringComponent } from '../gathering/gathering.component';
import { GatheringRequestsComponent } from '../gathering/gathering-requests/gathering-requests.component';
import { ParticipantCardComponent } from '../participants-list/participant-card/participant-card.component';
import { ParticipantsListComponent } from '../participants-list/participants-list.component';
import { Participant } from '../../../models/participant';
import { Inquiry } from '../../../models/inquiry';
import { PinDetailsComponent } from '../pin-details.component';
import { PinHeaderComponent } from '../pin-header/pin-header.component';
import { ReadonlyAddressComponent } from '../readonly-address/readonly-address.component';
import { PinLoginActionsComponent } from '../pin-login-actions/pin-login-actions.component';
import { PersonComponent } from '../person/person.component';
import { GroupService } from '../../../services/group.service';
import { LoginRedirectService } from '../../../services/login-redirect.service';
import { APIService } from '../../../services/api.service';
import { Observable } from 'rxjs/Rx';

describe('SayHiComponent', () => {
    let fixture: ComponentFixture<SayHiComponent>;
    let comp: SayHiComponent;
    let el;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                SayHiComponent,
                AddressFormComponent,
                GatheringComponent,
                GatheringRequestsComponent,
                ParticipantCardComponent,
                ParticipantsListComponent,
                PersonComponent,
                PinDetailsComponent,
                PinHeaderComponent,
                PinLoginActionsComponent,
                ReadonlyAddressComponent
            ],
            providers: [
                CookieService,
                PinService,
                SessionService,
                StateService,
                Angulartics2,
                LoginRedirectService,
                APIService
            ],
            imports: [RouterTestingModule.withRoutes([]), HttpModule],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SayHiComponent);
            comp = fixture.componentInstance;
        });
    }));

    fit('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    fit('should call login redirect if not logged in', inject([LoginRedirectService], (loginRedirectService) => {

        let mockRoute = "mockRoute";
        let sendSayHiFunc = comp.sendSayHi;
        comp.isLoggedIn = false;

        spyOn(loginRedirectService, 'redirectToLogin');

        comp.sayHi();

        expect(loginRedirectService.redirectToLogin).toHaveBeenCalled();

    }));




});
