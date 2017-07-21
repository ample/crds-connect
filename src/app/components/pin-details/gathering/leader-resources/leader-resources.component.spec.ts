/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr';
import { ModalModule } from 'ngx-bootstrap';

import { LeaderResourcesComponent } from './leader-resources.component';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { PinService } from '../../../../services/pin.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';
import { AppSettingsService } from '../../../../services/app-settings.service';
import { ParticipantService } from '../../../../services/participant.service';

import { Person } from '../../../../models/person';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';
import { ModalDirective } from 'ngx-bootstrap/modal';

describe('LeaderResourcesComponent', () => {
    let fixture: ComponentFixture<LeaderResourcesComponent>;
    let comp: LeaderResourcesComponent;
    let el;

    let mockContentService, mockPinService, mockFormBuilder, mockRouter, mockModal;
    let mockBlandPageService, mockStateService, mockToast, mockAppSettings, mockParticipantService;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [
                ModalModule.forRoot()
            ],
            declarations: [
                LeaderResourcesComponent
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(LeaderResourcesComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('LeaderResourcesComponent should exist', () => {
        expect(comp).toBeTruthy();
    });

});
