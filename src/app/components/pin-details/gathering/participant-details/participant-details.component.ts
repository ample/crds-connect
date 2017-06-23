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
    private groupParticipantId: number;
    private participantAddress: Address;
    private isValidAddress: boolean;
    private componentIsReady: boolean = false;
    private redirectUrl: string;

    constructor(private participantService: ParticipantService,
        private route: ActivatedRoute, private state: StateService, private router: Router,
        private blandPageService: BlandPageService, private addressService: AddressService) { }

    public ngOnInit() {
        this.state.setLoading(true);
        this.route.params.subscribe(params => {
            this.groupParticipantId = +params['groupParticipantId'];
            this.groupId = +params['groupId'];
            this.redirectUrl = `/${this.router.url.split('/')[1]}/${this.groupId}`;

            this.loadParticipantData();
        });
    }

    private handleError() {
        this.blandPageService.goToDefaultError(this.redirectUrl);
    }

    private isParticipantAddressValid(): boolean {
        return ((this.participantAddress != null) && (this.participantAddress.city != null || this.participantAddress.state != null
            || this.participantAddress.zip != null));
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
            }, error => {
                this.handleError();
                console.log('error retreving participant information');
            });
    }
}
