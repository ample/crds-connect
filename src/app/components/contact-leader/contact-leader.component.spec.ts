/* tslint:disable:no-unused-variable */
import { Angulartics2 } from 'angulartics2';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule  } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AddressService } from '../../services/address.service';
import { AppSettingsService } from '../../services/app-settings.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { IFrameParentService } from '../../services/iframe-parent.service';
import { GroupService } from '../../services/group.service';
import { HostApplicationHelperService } from '../../services/host-application-helper.service';
import { MsgToLeader } from '../../models/msg-to-leader';
import { ParticipantService } from '../../services/participant.service';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { PinService } from '../../services/pin.service';
import { BlandPageService } from '../../services/bland-page.service';

import { ContactLeaderComponent } from './contact-leader.component';

import { AlertModule } from 'ngx-bootstrap';

describe('Component: Contact Leader', () => {

    let component;
    let fixture;
    let mockAddressService,
        mockIFrameParentService,
        mockStoreService,
        mockStateService,
        mockSessionService,
        mockContentService,
        mockCookieService,
        mockAngulartics2,
        mockLocation,
        mockLoginRedirectService,
        mockParticipantService,
        mockPinService,
        mockBlandPageService,
        mockValidate,
        mockGroupService,
        mockAppSettings,
        mockRouter,
        mockToastsManager;

    beforeEach(() => {
        mockAddressService = jasmine.createSpyObj<PinService>('addressService', ['postPin']);
        mockIFrameParentService = jasmine.createSpyObj<IFrameParentService>('iFrameParentService', ['constructor', 'getIFrameParentUrl']);
        mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantService', ['submitLeaderMessageToAPI']);
        mockStoreService = jasmine.createSpyObj<StoreService>('storeService', ['constructor']);
        mockStateService = jasmine.createSpyObj<StateService>('stateService', ['setLoading']);
        mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['constructor']);
        mockContentService= jasmine.createSpyObj<ContentService>('contentService', ['getContent']);
        mockCookieService = jasmine.createSpyObj<CookieService>('cookieService', ['constructor']);
        mockAngulartics2 = jasmine.createSpyObj<Angulartics2>('angularTics', ['constuctor']);
        mockLocation = jasmine.createSpyObj<Location>('location', ['back']);
        mockLoginRedirectService = jasmine.createSpyObj<LoginRedirectService>('loginRedirectService', ['constructor']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['constructor']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('BlandPageService', ['navigateToMessageSentToLeaderConfirmation']);
        mockValidate = jasmine.createSpyObj<Validators>('Validators', ['minLength', 'maxLength', 'required']);
        mockGroupService = jasmine.createSpyObj<GroupService>('groupService', ['constructor']);
        mockAppSettings = jasmine.createSpyObj<AppSettingsService>('appSettings', ['constructor']);
        mockRouter = {
          url: '/connect/contact-leader/1234',
          routerState: { snapshot: { url: 'groupsv2/contact-leader/1234' } },
          navigate: jasmine.createSpy('navigate')
        };
        mockToastsManager = jasmine.createSpyObj<ToastsManager>('toastsManager', ['error']);

        TestBed.configureTestingModule({
            declarations: [
                ContactLeaderComponent
            ],
            imports: [
                RouterTestingModule.withRoutes([]), HttpModule, JsonpModule, ReactiveFormsModule, AlertModule
            ],
            providers: [
                { provide: AddressService, useValue: mockAddressService },
                { provide: ContentService, useValue: mockContentService },
                HostApplicationHelperService,
                { provide: IFrameParentService, useValue: mockIFrameParentService },
                { provide: Location, useValue: mockLocation },
                { provide: ParticipantService, useValue: mockParticipantService },
                { provide: StoreService, useValue: mockStoreService },
                { provide: StateService, useValue: mockStateService },
                { provide: SessionService, useValue: mockSessionService },
                { provide: CookieService, useValue: mockCookieService },
                { provide: Angulartics2, useValue: mockAngulartics2 },
                { provide: LoginRedirectService, useValue: mockLoginRedirectService },
                { provide: PinService, useValue: mockPinService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: Validators, useValue: mockValidate },
                { provide: GroupService, useValue: mockGroupService },
                { provide: Router, useValue: mockRouter},
                { provide: AppSettingsService, useValue: mockAppSettings },
                { provide: ToastsManager, useValue: mockToastsManager }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
        this.fixture = TestBed.createComponent(ContactLeaderComponent);
        this.component = this.fixture.componentInstance;

    });

    it('should create an instance', () => {
      expect(this.component).toBeTruthy();
    });

    it('should send message to leader', () => {
      let mockMsgToLeader: MsgToLeader = new MsgToLeader('lol','rofl');
      (mockParticipantService.submitLeaderMessageToAPI).and.returnValue(Observable.of({}));
      this.component.groupId = 2;
      this.component.sendLeaderMessage(mockMsgToLeader);
      expect(mockParticipantService.submitLeaderMessageToAPI).toHaveBeenCalledWith(2, mockMsgToLeader);
      expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should send message to leader', () => {
      let mockMsgToLeader: MsgToLeader = new MsgToLeader('lol','rofl');
      (mockParticipantService.submitLeaderMessageToAPI).and.returnValue(Observable.throw({}));
      (mockContentService.getContent).and.returnValue('whee');
      this.component.groupId = 2;
      this.component.sendLeaderMessage(mockMsgToLeader);
      expect(mockParticipantService.submitLeaderMessageToAPI).toHaveBeenCalledWith(2, mockMsgToLeader);
      expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
      expect(mockContentService.getContent).toHaveBeenCalledWith('groupFinderContactCrdsError');
      expect(mockToastsManager.error).toHaveBeenCalledWith('whee', null, {toastLife: 3000});
    });

    it('should close fauxdal', () => {
      this.component.closeClick();
      expect(mockLocation.back).toHaveBeenCalled();
    });

});
