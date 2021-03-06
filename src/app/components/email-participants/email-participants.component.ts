import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'email-participants',
  templateUrl: 'email-participants.component.html'
})
export class EmailParticipantsComponent implements OnInit {

  @Input() participantEmails: string[];
  public commaSeparatedParticipantEmails: string;
  public areThereAnyParticipantsInGroup: boolean;

  constructor(private toastr: ToastsManager) {}

  public ngOnInit(): void {
    this.areThereAnyParticipantsInGroup = this.participantEmails.length > 0;
    this.commaSeparatedParticipantEmails = this.participantEmails.join(', ');
  }

  public copyEmailAddressesClicked(commaSeparatedParticipantEmails: string): void {
    this.displayEmailsCopiedToClipboardToast(commaSeparatedParticipantEmails);
  }

  public emailParticipantsClicked(commaSeparatedParticipantEmails: string): void {
    window.location.href = `mailto:${commaSeparatedParticipantEmails}`;
  }

  public displayEmailsCopiedToClipboardToast(commaSeparatedParticipantEmails: string): void {
    const addressSuffix: string = this.participantEmails.length === 1 ? '' : 'es';
    const toastMsg: string = `${this.participantEmails.length} email address${addressSuffix} copied to clipboard!`;
    this.toastr.success(toastMsg);
  }

}
