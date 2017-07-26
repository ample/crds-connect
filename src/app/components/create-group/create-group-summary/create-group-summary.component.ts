import { Component, OnInit } from '@angular/core';
import { StateService } from '../../../services/state.service';

@Component({
    selector: 'create-group-summary',
    templateUrl: './create-group-summary.component.html',
})
export class CreateGroupSummaryComponent implements OnInit {
    constructor(private state: StateService) { }

    ngOnInit() {
        this.state.setLoading(true);
        this.state.setPageHeader('start a group', '/');
        this.state.setLoading(false);
    }
}
