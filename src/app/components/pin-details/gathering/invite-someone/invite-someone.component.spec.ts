import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr';

import { InviteSomeoneComponent } from './invite-someone.component';

import { ContentService } from 'crds-ng2-content-block';
import { GroupInquiryService } from '../../../../services/group-inquiry.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';
import { AppSettingsService } from '../../../../services/app-settings.service';

import { Person } from '../../../../models/person';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';

describe('InviteSomeoneComponent', () => {
  let fixture: ComponentFixture<InviteSomeoneComponent>;
  let comp: InviteSomeoneComponent;
  let el;

  let mockContentService,
    mockFormBuilder,
    mockRouter,
    mockGroupInquiryService,
    mockBlandPageService,
    mockStateService,
    mockToast,
    mockAppSettings;

  beforeEach(() => {
    mockAppSettings = jasmine.createSpyObj<AppSettingsService>('app', ['setAppSettings', 'isConnectApp']);
    mockAppSettings.finderType = 'CONNECT';
    mockFormBuilder = jasmine.createSpyObj<FormBuilder>('fb', ['']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['']);
    mockGroupInquiryService = jasmine.createSpyObj<GroupInquiryService>('groupInquiryService', ['inviteToGroup']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);
    mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
    mockToast = jasmine.createSpyObj<ToastsManager>('toast', ['error']);
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);

    TestBed.configureTestingModule({
      declarations: [InviteSomeoneComponent],
      providers: [
        { provide: FormBuilder, useValue: mockFormBuilder },
        { provide: Router, useValue: mockRouter },
        { provide: AppSettingsService, useValue: mockAppSettings },
        { provide: GroupInquiryService, useValue: mockGroupInquiryService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: StateService, useValue: mockStateService },
        { provide: ToastsManager, useValue: mockToast },
        { provide: ContentService, useValue: mockContentService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(
    async(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(InviteSomeoneComponent);
        comp = fixture.componentInstance;
      });
    })
  );

  it('component should exist', () => {
    expect(comp).toBeTruthy();
  });

  it('should init form with formGroup', () => {
    comp.ngOnInit();
    expect(comp.inviteFormGroup).toBeTruthy();
    expect(comp.inviteFormGroup.controls['firstname']).toBeTruthy();
    expect(comp.inviteFormGroup.controls['lastname']).toBeTruthy();
    expect(comp.inviteFormGroup.controls['email']).toBeTruthy();
  });

  it('should successfully submit', () => {
    const someone = new Person('TestFirstname', 'TestLastname', 'person@email.com');
    const isValid = true;
    const gatheringId = 123;
    const participantId = 456;
    const param = { value: someone, valid: isValid };
    const blandPageDetails = new BlandPageDetails(
      'Return to my pin',
      '<h1 class="title">Invitation Sent</h1>' +
        // tslint:disable-next-line:max-line-length
        `<p>${someone.firstname.slice(0, 1).toUpperCase()}${someone.firstname
          .slice(1)
          .toLowerCase()} ${someone.lastname.slice(0, 1).toUpperCase()}. has been notified.</p>`,
      BlandPageType.Text,
      BlandPageCause.Success,
      `gathering/${gatheringId}`
    );

    mockGroupInquiryService.inviteToGroup.and.returnValue(Observable.of({}));
    comp.gatheringId = gatheringId;
    comp.participantId = participantId;

    comp.onSubmit(param);

    expect(mockStateService.setLoading).toHaveBeenCalledWith(true);
    expect(mockGroupInquiryService.inviteToGroup).toHaveBeenCalledWith(gatheringId, someone, 'CONNECT');
    expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(blandPageDetails);
  });

  it('should fail to submit', () => {
    const expectedText = '<p>invite failed</p>';
    const someone = new Person('TestFirstname', 'TestLastname', 'person@email.com');
    const isValid = true;
    const gatheringId = 123;
    const participantId = 456;
    const param = { value: someone, valid: isValid };

    mockContentService.getContent.and.returnValue(Observable.of({ content: expectedText }));
    mockAppSettings.finderType = 'CONNECT';

    mockGroupInquiryService.inviteToGroup.and.returnValue(Observable.throw({}));
    comp.gatheringId = gatheringId;
    comp.participantId = participantId;

    comp.onSubmit(param);

    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    expect(mockGroupInquiryService.inviteToGroup).toHaveBeenCalledWith(gatheringId, someone, 'CONNECT');
    expect(mockToast.error).toHaveBeenCalledWith(expectedText);
  });
});
