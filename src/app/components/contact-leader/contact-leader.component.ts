import { Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastsManager } from 'ng2-toastr';
import { LeadershipApplicationType, GroupLeaderApplicationStatus, LeaderStatus } from '../../shared/constants';
import { BlandPageService } from '../../services/bland-page.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { LoginRedirectService } from '../../services/login-redirect.service';
import { ParticipantService } from '../../services/participant.service';
import { StateService } from '../../services/state.service';
import { StoreService } from '../../services/store.service';

import { MsgToLeader } from '../../models/msg-to-leader';

@Component({
    selector: 'contact-leader',
    templateUrl: 'contact-leader.component.html',
    styles: ['.fauxdal-wrapper { overflow-y: auto; }']
})
export class ContactLeaderComponent implements OnInit, AfterViewInit {
  public contactLeaderForm: FormGroup;
  public isFormSubmitted: boolean = false;
  public groupId: number;
  public msgToLeader: MsgToLeader = new MsgToLeader('', '');

  constructor(
    private blandPageService: BlandPageService,
    private content: ContentService,
    private location: Location,
    private participantService: ParticipantService,
    private route: ActivatedRoute,
    private toast: ToastsManager,
    private state: StateService) {}

  public ngOnInit() {
    this.contactLeaderForm = new FormGroup({
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });

    this.route.params.subscribe(params => {
      this.groupId = +params.groupId;
    });

    this.state.setLoading(false);
  }

  public ngAfterViewInit() {
    // This component is rendered within a fauxdal,
    // so we need the following selector added to <body> element
    document.querySelector('body').classList.add('fauxdal-open');
  }

  public onSubmit({ value, valid }: { value: MsgToLeader, valid: boolean }) {
    // Touch all the fields so we get correct validation styles for pristine, required fields
    Object.values(this.contactLeaderForm.controls).filter(control => control.markAsTouched());

    this.isFormSubmitted = true;
    if (valid) {
      this.sendLeaderMessage(value);
    }
  }

  private sendLeaderMessage(msgToLeader: MsgToLeader): void {
    this.state.setLoading(true);
    this.participantService.submitLeaderMessageToAPI(this.groupId, msgToLeader).subscribe(
      next => {
        this.blandPageService.navigateToMessageSentToLeaderConfirmation();
        this.state.setLoading(false);
      }, err => {
        this.state.setLoading(false);
        this.toast.error(this.content.getContent('groupFinderContactCrdsError'), null, {toastLife: 3000});
      }
    );
  }

  public closeClick() {
    this.location.back();
  }
}
