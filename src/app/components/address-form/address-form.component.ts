import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, Input, Output, EventEmitter  } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { APIService } from '../../services/api.service';
import { StateService } from '../../services/state.service';
import { AddMeToTheMapHelperService } from '../../services/add-me-to-map-helper.service';
import { LocationService } from '../../services/location.service';
import { LookupTable } from '../../models/lookup-table';

import { Pin } from '../../models/pin';
import { UserDataForPinCreation } from '../../models/user-data-for-pin-creation';
import { Address } from '../../models/address';
import { usStatesList } from '../../shared/constants';


@Component({
    selector: 'address-form',
    templateUrl: 'address-form.component.html',
    styleUrls: ['address-form.component.css']
})
export class AddressFormComponent implements OnInit {

    @Input() userData: UserDataForPinCreation;
    @Input() buttonText: String = 'Add';
    @Input() routeToGoTo: string = null;
    @Output() save: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    public stateList: Array<string>;
    public addressFormGroup: FormGroup;
    public stateListForSelect: Array<any>;
    public submissionError: boolean = false;


    constructor(private api: APIService,
        private fb: FormBuilder,
        private hlpr: AddMeToTheMapHelperService,
        private content: ContentService,
        private locationService: LocationService,
        private router: Router,
        private route: ActivatedRoute,
        private state: StateService) { }


    public ngOnInit(): void {
        this.stateList = usStatesList;
        this.state.setLoading(false);

        this.addressFormGroup = new FormGroup({
            addressLine1: new FormControl(this.hlpr.getStringField(this.userData, 'addressLine1'), [Validators.required]),
            addressLine2: new FormControl(this.hlpr.getStringField(this.userData, 'addressLine2')),
            city: new FormControl(this.hlpr.getStringField(this.userData, 'city'), [Validators.required]),
            state: new FormControl(this.userData.address.state, [Validators.required]),
            zip: new FormControl(this.hlpr.getStringField(this.userData, 'zip'), [Validators.required])
        });

    }

    public onSubmit({ value, valid }: { value: any, valid: boolean }) {
        this.setSubmissionErrorWarningTo(false);
        value.isFormDirty = this.addressFormGroup.dirty;

        let pinToSubmit: Pin = this.hlpr.createNewPin(value, this.userData);

        this.api.postPin(pinToSubmit).subscribe(
            next => {
                this.save.emit(true);
            },
            err => {
                this.setSubmissionErrorWarningTo(true);
                this.save.emit(false);
            }
        );
    }

    public setSubmissionErrorWarningTo(isErrorActive) {
        this.submissionError = isErrorActive;
    }

}

