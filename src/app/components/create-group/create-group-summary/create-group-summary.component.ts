import { Component, OnInit } from '@angular/core';
import { StateService } from '../../../services/state.service';
import { textConstants} from '../../../shared/constants';

@Component({
    selector: 'create-group-summary',
    templateUrl: './create-group-summary.component.html',
})
export class CreateGroupSummaryComponent implements OnInit {
    constructor(private state: StateService) { }

    ngOnInit() {
        this.state.setLoading(true);
        this.state.setPageHeader(textConstants.GROUP_PAGE_HEADERS.ADD, '/');
        this.state.setLoading(false);
    }
}
