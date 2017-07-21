import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { AddressService } from '../../../../services/address.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';
import { Participant, Address } from '../../../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../../../services/participant.service';
import { Component, Input, OnInit } from '@angular/core';
import { GroupRole, MaxGroupApprentices, MaxGroupLeaders } from '../../../../shared/constants';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'participant-details',
  templateUrl: './participant-details.component.html'
})
export class ParticipantDetailsComponent implements OnInit {
  private participant: Participant;
  private groupId: number;
  private groupParticipantId: number;
  private participantAddress: Address;
  private isValidAddress: boolean;
  private componentIsReady: boolean = false;
  private redirectUrl: string;
  private selectedRole: number = GroupRole.MEMBER;
  private leaderCount: number = 0;
  private apprenticeCount: number = 0;

  GroupRole: any = GroupRole;

  constructor(private participantService: ParticipantService,
              private route: ActivatedRoute,
              private state: StateService,
              private router: Router,
              private blandPageService: BlandPageService,
              private addressService: AddressService,
              private toast: ToastsManager,
              private content: ContentService) { }

  public ngOnInit() {
    this.state.setLoading(true);
    this.route.params.subscribe(params => {
      this.groupParticipantId = +params['groupParticipantId'];
      this.groupId = +params['groupId'];
      this.redirectUrl = `/${this.router.url.split('/')[1]}/${this.groupId}`;

      this.loadParticipantData();
    });
  }

  private countLeaders() {
    this.participantService.getAllParticipantsOfRoleInGroup(this.groupId, GroupRole.LEADER).subscribe(
      participants => { this.leaderCount = participants.length; },
      failure => { this.leaderCount = 0; }
    );
  }

  private countApprenticeses() {
    this.participantService.getAllParticipantsOfRoleInGroup(this.groupId, GroupRole.APPRENTICE).subscribe(
      participants => { this.apprenticeCount = participants.length; },
      failure => { this.apprenticeCount = 0; }
    );
  }

  private handleError() {
    this.blandPageService.goToDefaultError(this.redirectUrl);
  }

  private isParticipantAddressValid(): boolean {
    return ((this.participantAddress != null) &&
      (this.participantAddress.city != null ||
      this.participantAddress.state != null ||
      this.participantAddress.zip != null));
  }

  public isParticipantApprovedLeader(): boolean {
    return this.participant.isApprovedLeader;
  }

  public onRemoveParticipant(): void {
    this.router.navigate(['./remove/'], { relativeTo: this.route });
  }

  private loadParticipantData(): void {
    this.participantService.getGroupParticipant(this.groupId, this.groupParticipantId).subscribe(p => {
      if (p == null) {
        this.handleError();
      } else {
        this.participant = p;
        this.selectedRole = p.groupRoleId;
        this.componentIsReady = true;
        this.addressService.getPartialPersonAddress(this.participant.participantId).finally(() => {
          this.isValidAddress = this.isParticipantAddressValid();
          this.state.setPageHeader('Participant', this.redirectUrl);
          this.state.setLoading(false);
        }).subscribe(address => {
          this.participantAddress = address;
        }, error => {
          console.log(error);
        });
      }
      this.countApprenticeses();
      this.countLeaders();
    }, error => {
      this.handleError();
      console.log('error retreving participant information');
    });
  }

  public onSelectRole(newRole: GroupRole) {
    this.selectedRole = newRole;
  }

  public saveChanges() {
    if (this.selectedRole === this.participant.groupRoleId) {
      this.router.navigate(['/small-group/' + this.groupId]);
      return;  // Don't make any changes if the participant is already assigned to the selected role
    }

    if (this.selectedRole === GroupRole.LEADER && this.leaderCount >= MaxGroupLeaders) {
      this.toast.warning(this.content.getContent('finderMaxLeadersExceeded'), null, {toastLife: 3000});
      return;
    }

    if (this.selectedRole === GroupRole.APPRENTICE && this.apprenticeCount >= MaxGroupApprentices) {
      this.toast.warning(this.content.getContent('finderMaxApprenticeExceeded'), null, {toastLife: 3000});
      return;
    }

    this.state.setLoading(true);
    this.participantService.updateParticipantRole(this.groupId, this.participant.participantId, this.selectedRole).subscribe(
      p => {
        console.log('success');
        // go to success page
        this.router.navigate(['/small-group/' + this.groupId]);
      },
      failure => {
        this.toast.warning('Something seems to have gone wrong. Please try again.', null, {toastLife: 3000});
        this.state.setLoading(false);
      }
    );
  }
}
