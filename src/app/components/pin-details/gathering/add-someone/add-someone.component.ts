import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailAddressValidator } from '../../../../validators/email-address.validator';
import { ToastsManager } from 'ng2-toastr';

import { AppSettingsService } from '../../../../services/app-settings.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { GroupInquiryService } from '../../../../services/group-inquiry.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { ParticipantService } from '../../../../services/participant.service';
import { StateService } from '../../../../services/state.service';

import { Person } from '../../../../models/person';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';
import { GroupRole } from '../../../../shared/constants';

@Component({
  selector: 'add-someone',
  templateUrl: './add-someone.html'
})
export class AddSomeoneComponent implements OnInit {
  @Input() gatheringId: number;
  @Input() participantId: number;

  public showFauxdal = false;
  public addFormGroup: FormGroup;
  public isFormSubmitted: boolean = false;
  public selectedMatch: Person = new Person();
  public matchFound: boolean = false;
  public useSelectedButtonDisabled: boolean = true;

  constructor(
    private groupInquiryService: GroupInquiryService,
    private blandPageService: BlandPageService,
    private state: StateService,
    private toast: ToastsManager,
    private content: ContentService,
    private appSettings: AppSettingsService,
    private participantService: ParticipantService
  ) {}

  ngOnInit() {
    this.addFormGroup = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, EmailAddressValidator.validateEmail])
    });
  }

  private showResultsFauxdal(): void {
    document.querySelector('body').style.overflowY = 'hidden';
    this.showFauxdal = true;
  }

  private hideResultsFauxdal(): void {
    document.querySelector('body').style.overflowY = 'auto';
    this.showFauxdal = false;
  }

  public fauxdalUseSelected(): void {
    this.hideResultsFauxdal();
    this.state.setLoading(true);
    this.addToGroup(this.selectedMatch);
  }

  public fauxdalUseEntered(): void {
    this.hideResultsFauxdal();
    this.state.setLoading(true);
    this.addToGroup(this.selectedMatch);
  }

  onSubmit({ value, valid }: { value: any; valid: boolean }) {
    this.isFormSubmitted = true;
    this.matchFound = false;
    if (valid) {
      let someone = new Person(value.firstname, value.lastname, value.email);
      this.selectedMatch = someone;
      this.state.setLoading(true);
      // get matches
      this.groupInquiryService.getMatch(someone).subscribe(
        isMatchFound => {
          // display the fauxdal so the user can decide
          this.state.setLoading(false);
          isMatchFound === true ? (this.matchFound = true) : (this.matchFound = false);
          this.selectedMatch = someone;
          this.showResultsFauxdal();
        },
        failure => {
          this.state.setLoading(false);
          this.toast.error(this.content.getContent('finderErrorInvite'));
        }
      );
    }
  }

  addToGroup(someone: Person) {
    // add someone to the group
    window.scrollTo(0, 0);
    this.groupInquiryService.addToGroup(this.gatheringId, someone, GroupRole.MEMBER).subscribe(
      success => {
        this.participantService.clearGroupFromCache(this.gatheringId);
        const bpd = new BlandPageDetails(
          'Return to my group',
          '<h1 class="title">Your group is growing!</h1>' +
            // tslint:disable-next-line:max-line-length
            `<p>${someone.firstname.slice(0, 1).toUpperCase()}${someone.firstname
              .slice(1)
              .toLowerCase()} ${someone.lastname.slice(0, 1).toUpperCase()}. has been added to your group.</p>`,
          BlandPageType.Text,
          BlandPageCause.Success,
          `gathering/${this.gatheringId}`
        );

        this.blandPageService.primeAndGo(bpd);
      },
      failure => {
        this.state.setLoading(false);
        this.toast.warning('This user is already in your group.');
      }
    );
  }
}
