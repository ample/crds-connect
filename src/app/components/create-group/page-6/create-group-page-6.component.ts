import { ParticipantService } from '../../../services/participant.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { BlandPageService } from '../../../services/bland-page.service';
import { LookupTable } from '../../../models';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';
import { LookupService } from '../../../services/lookup.service';
import { usStatesList } from '../../../shared/constants';

@Component({
    selector: 'create-group-page-6',
    templateUrl: './create-group-page-6.component.html',
})
export class CreateGroupPage6Component implements OnInit {
    public profileForm: FormGroup;
    private sites: LookupTable[] = [];
    private isComponentReady: boolean = false;
    private isSubmitted: boolean = false;
    private groupVisabilityInvalid: boolean = false;
    private stateList: Array<string>;
    private lastPage = '/create-group/page-5';

    constructor(private blandPageService: BlandPageService,
                private fb: FormBuilder,
                private state: StateService,
                private createGroupService: CreateGroupService,
                private router: Router,
                private lookupService: LookupService) { }

    ngOnInit(): void {
        this.state.setPageHeader('start a group', this.lastPage);
        this.stateList = usStatesList;
        Observable.forkJoin(
            this.lookupService.getSites(),
            this.createGroupService.initializePageSix()
            )
            .subscribe(dataArray => {
                this.sites = dataArray[0];
                this.profileForm = this.fb.group({
                    crossroadsSite: [null, Validators.required],
                    gender: [this.createGroupService.profileData.genderId, Validators.required],
                    addressLine1: [this.createGroupService.profileData.addressLine1, Validators.required],
                    addressLine2: [this.createGroupService.profileData.addressLine2],
                    city: [this.createGroupService.profileData.city, Validators.required],
                    state: [this.createGroupService.profileData.state, Validators.required],
                    zip: [this.createGroupService.profileData.postalCode, Validators.required]
                });
                this.isComponentReady = true;
                this.state.setLoading(false);
            }, error => {
                console.log(error);
                this.blandPageService.goToDefaultError(this.lastPage);
            });
    }

    public onSubmit(form: FormGroup): void {
        this.state.setLoading(true);
        this.isSubmitted = true;
        if (form.valid) {
            this.createGroupService.group.congregationId =
                this.createGroupService.group.congregationId || this.createGroupService.profileData.congregationId;
            this.router.navigate(['/create-group/preview']);
        } else {
            this.groupVisabilityInvalid = true;
            this.state.setLoading(false);
        }
    }

    public onBack(): void {
        this.router.navigate([this.lastPage]);
    }
}
