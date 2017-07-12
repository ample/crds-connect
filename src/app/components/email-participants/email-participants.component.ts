import { Component, HostListener, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

import { Angulartics2 } from 'angulartics2';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'email-participants',
  templateUrl: 'email-participants.component.html'
})
export class EmailParticipantsComponent implements OnInit {

  @Input() participantEmails: string[];
  public commaSeperatedParticipantEmails: string;
  public areThereAnyParticipantsInGroup: boolean;

  constructor(private toastr: ToastsManager) {}

  //TODO: Remove testing code
  // @HostListener('document:copy', ['$event'])
  // onCopy(event) {
  //   console.log('COPY EVENT PICKED UP!');
  // }

  public ngOnInit(): void {
    this.areThereAnyParticipantsInGroup = this.participantEmails.length > 0;
    this.commaSeperatedParticipantEmails = this.participantEmails.join(', ');
  }

  public copyEmailAddressesClicked(commaSeperatedParticipantEmails: string): void {
    this.displayEmailsCopiedToClipboardToast(commaSeperatedParticipantEmails);
  }

  public emailParticipantsClicked(commaSeperatedParticipantEmails: string): void {
    window.location.href = `mailto:${commaSeperatedParticipantEmails}`;
  }

  public displayEmailsCopiedToClipboardToast(commaSeperatedParticipantEmails: string): void {
    let addressSuffix: string = this.participantEmails.length === 1 ? '' : 'es';
    let toastMsg: string = `${this.participantEmails.length} email address${addressSuffix} copied to clipboard!`;
    this.toastr.success(toastMsg);
  }

}
