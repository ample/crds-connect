import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { BlandPageService } from '../../../services/bland-page.service';
import { LookupTable } from '../../../models';
import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';
import { LookupService } from '../../../services/lookup.service';

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

    constructor(private blandPageService: BlandPageService,
                private fb: FormBuilder,
                private state: StateService,
                private createGroupService: CreateGroupService,
                private router: Router,
                private lookupService: LookupService,
                private locationService: Location) { }

    ngOnInit(): void {
        this.state.setPageHeader('start a group', '/create-group/page-5');
        Observable.forkJoin(
            this.lookupService.getSites(),
            this.createGroupService.initializePageSix()
            )
            .finally(() => {
                this.profileForm = this.fb.group({
                    crossroadsSite: [null, Validators.required],
                    gender: [this.createGroupService.profileData.genderId, Validators.required]
                });
                this.isComponentReady = true;
                this.state.setLoading(false);
            })
            .subscribe(sites => {
                this.sites = sites[0];
            }, error => {
                console.log(error);
                this.blandPageService.goToDefaultError('/create-group/page-5');
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

    public back(): void {
        this.locationService.back();
    }
}
