import { AddressService } from '../../../../services/address.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';
import { Participant, Address } from '../../../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../../../services/participant.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'participant-details',
    templateUrl: './participant-details.component.html'
})
export class ParticipantDetailsComponent implements OnInit {
    private participant: Participant;
    private groupId: number;
    private participantAddress: Address;
    private isValidAddress: boolean;
    private redirectUrl: string;

    constructor(private participantService: ParticipantService,
        private route: ActivatedRoute, private state: StateService, private router: Router,
        private blandPageService: BlandPageService, private addressService: AddressService) { }

    ngOnInit() {
        this.state.setLoading(true);
        this.route.params.subscribe(params => {
            console.log(params);
            let groupParticipantId: number = +params['groupParticipantId'];
            this.groupId = +params['groupId'];
            this.redirectUrl = `/${this.router.url.split('/')[1]}/${this.groupId}`;

            this.participantService.getParticipants(this.groupId).subscribe(groupParticipants => {
                this.participant = groupParticipants.find((p: Participant) => { return p.groupParticipantId === groupParticipantId; });
                if (this.participant == null) {
                    this.handleError();
                } else {
                    this.addressService.getPartialPersonAddress(this.participant.participantId).finally(() => {
                        this.isValidAddress = this.isParticipantAddressValid();
                        this.state.setPageHeader('Participant', this.redirectUrl);
                        this.state.setLoading(false);
                    })
                    .subscribe(
                        (address) => {
                            this.participantAddress = address;
                        }, error => {
                            console.log(error);
                        });
                }
            }, error => {
                console.log('Error retrieving participant information');
                this.handleError();
            });
        });
    }

    handleError() {
        this.blandPageService.goToDefaultError(this.redirectUrl);
    }

    isParticipantAddressValid(): boolean {
        return ((this.participantAddress != null) && (this.participantAddress.city != null || this.participantAddress.state != null
                || this.participantAddress.zip != null));
    }
}
