import { StateService } from '../../../services/state.service';
import { CreateGroupService } from '../create-group-data.service';
import { Pin, Participant } from '../../../models';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'create-group-preview',
    templateUrl: './create-group-preview.component.html'
})
export class CreateGroupPreviewComponent implements OnInit {
    private smallGroupPin: Pin;
    private leaders: Participant[];
    private isComponentReady: boolean = false;
    constructor(private createGroupService: CreateGroupService, private stateService: StateService) { }

    ngOnInit() {
        this.smallGroupPin = this.createGroupService.getSmallGroupPinFromGroupData();
        this.leaders = this.createGroupService.getLeaders();
        this.isComponentReady = true;
        this.stateService.setLoading(false);
    }
}
