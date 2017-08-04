
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import 'rxjs/add/observable/of';
import { ToastsManager } from 'ng2-toastr';

import { EmailParticipantsComponent } from '../../components/email-participants/email-participants.component';


describe('Component: Map', () => {

  let mockToastr;

  beforeEach(() => {
    mockToastr = jasmine.createSpyObj<ToastsManager>('toastr', ['success', 'error']);

    TestBed.configureTestingModule({
      declarations: [
        EmailParticipantsComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ToastsManager, useValue: mockToastr }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    this.fixture = TestBed.createComponent(EmailParticipantsComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should show toast notifying the user that a single email was copied to clipboard', () => {

    let mockListOfParticipantEmails: string[] = ['lol@yahoo.com'];
    let mockSingleEmailCopiedMsg: string = '1 email address copied to clipboard!';

    this.component.participantEmails = mockListOfParticipantEmails;
    this.component.displayEmailsCopiedToClipboardToast(mockListOfParticipantEmails[0]);
    expect(mockToastr.success).toHaveBeenCalledWith(mockSingleEmailCopiedMsg);
  });

  it('should show plural toast when copying more than one email address to clipboard', () => {

    let mockListOfParticipantEmails: string[] = ['lol@yahoo.com', 'rofl@yahoo.com'];
    let mockConcatedEmailListString: string = 'lol@yahoo.com,rofl@yahoo.com';
    let mockMultipleEmailsCopiedMsg: string = '2 email addresses copied to clipboard!';

    this.component.participantEmails = mockListOfParticipantEmails;
    this.component.displayEmailsCopiedToClipboardToast(mockConcatedEmailListString);
    expect(mockToastr.success).toHaveBeenCalledWith(mockMultipleEmailsCopiedMsg);
  });

});
