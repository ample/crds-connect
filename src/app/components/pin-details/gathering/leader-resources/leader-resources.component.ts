import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AppSettingsService } from '../../../../services/app-settings.service';
import { ParticipantService } from '../../../../services/participant.service';
import { StateService } from '../../../../services/state.service';

import { UserState, GroupResourcesUrl, LeaderResourcesUrl } from '../../../../shared/constants';

@Component({
    selector: 'leader-resources',
    templateUrl: './leader-resources.html'
})

export class LeaderResourcesComponent  {

    constructor() { }

    public onLeaderResourcesClicked() {
        window.location.href = LeaderResourcesUrl;
    }

    public onGroupResourcesClicked() {
        window.location.href = GroupResourcesUrl;
    }
}
