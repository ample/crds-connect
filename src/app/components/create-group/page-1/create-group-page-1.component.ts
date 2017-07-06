import { Category } from '../../../models/category';
import { CreateGroupService } from '../create-group-data.service';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';

@Component({
    selector: 'create-group-page-1',
    templateUrl: './create-group-page-1.component.html',
})
export class CreateGroupPage1Component implements OnInit {
    private categories: Category[] = [];
    private selectedCategories: Category[] = [];
    public groupCategoryForm: FormGroup;
    private isComponentReady: boolean = false;

    constructor(private state: StateService,
        private lookup: LookupService,
        private fb: FormBuilder,
        private createGroupService: CreateGroupService) { }

    ngOnInit() {
        this.state.setLoading(true);
        this.state.setPageHeader('start a group', '/create-group');
        this.groupCategoryForm = new FormGroup({ page1: new FormGroup({}) });
        this.getCategories();
    }

    private getCategories(): void {
        if (this.createGroupService.isInitialized()) {
            let cats = this.createGroupService.getCategories();
            this.initializeCategories(cats);
        } else {
            this.lookup.getCategories().subscribe(
                categories => {
                    this.createGroupService.initialize();
                    this.createGroupService.setCategories(categories);
                    this.initializeCategories(categories);
                }
            );
        }
    }

    private initializeCategories(categories): void {
        this.categories = categories;

        this.categories.forEach((category) => {
            this.groupCategoryForm.addControl(category.name, new FormControl('', []));
            this.groupCategoryForm.addControl(`${category.name}-detail`, new FormControl('', []));
        });

        this.state.setLoading(false);
        this.isComponentReady = true;
    }

    public onSelect(category: Category): void {
        category.selected = !category.selected;
        this.groupCategoryForm.controls[category.name].setValue(category.selected);
        let inputFormControl = this.groupCategoryForm.controls[`${category.name}-detail`];
        if (category.selected) {
            inputFormControl.setValidators(Validators.required);
        } else {
            inputFormControl.setValidators(null);
        }
    }

    public onSubmit(value) {
        this.createGroupService.setCategories(this.categories);
    }
}
