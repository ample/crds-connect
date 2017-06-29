import { Category } from '../../../models/category';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';

import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'create-group-page-1',
    templateUrl: './create-group-page-1.component.html'
})
export class CreateGroupPage1Component implements OnInit {
    private categories: Category[] = [];
    constructor(private state: StateService, private lookup: LookupService) { }

    ngOnInit() {
        this.state.setPageHeader('start a group', '/create-group');
        this.initializeCategories();
    }

    private initializeCategories(): void {
        this.lookup.getCategories().subscribe(
            categories => {
                this.categories = categories;
                this.state.setLoading(false);            }
        );
    }

    public onSelect(category: Category): void {
        category.selected = !category.selected;
    }
}
