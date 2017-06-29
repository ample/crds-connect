import { StateService } from '../../../services/state.service';

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'create-group-summary',
    templateUrl: './create-group-summary.component.html',
})
export class CreateGroupSummaryComponent implements OnInit {
    constructor(private state: StateService) { }

    ngOnInit() {
        this.state.setPageHeader('Start a group', '/');
        this.state.setLoading(false);
    }
}
