import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Category } from '../../../models/category';
import { CreateGroupService } from '../create-group-data.service';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';

@Component({
    selector: 'create-group-page-1',
    templateUrl: './create-group-page-1.component.html',
})
export class CreateGroupPage1Component implements OnInit {
    public groupCategoryForm: FormGroup;
    private isSubmitted: boolean = false;
    private anyCategorySelected: boolean = false;

    constructor(private state: StateService,
                private createGroupService: CreateGroupService,
                private router: Router,
                private locationService: Location) { }

    ngOnInit() {
        this.state.setLoading(true);
        this.state.setPageHeader('start a group', '/create-group');
        this.groupCategoryForm = new FormGroup({});
        this.createGroupService.initializePageOne()
        .finally(() => {
            this.state.setLoading(false);
        })
        .subscribe(cats => {
            this.initializeCategories(cats);
        });
    }

    private initializeCategories(categories): void {
        categories.forEach((category) => {
            this.groupCategoryForm.addControl(category.name, new FormControl('', []));
            this.groupCategoryForm.addControl(`${category.name}-detail`, new FormControl('', []));
        });
    }

    public onSelect(category: Category): void {
        category.selected = !category.selected;
        this.anyCategorySelected = this.areAnyCategoriesSelected();
        this.groupCategoryForm.controls[category.name].setValue(category.selected);
        let inputFormControl = this.groupCategoryForm.controls[`${category.name}-detail`];
        if (category.selected) {
            inputFormControl.setValidators(Validators.required);
        } else {
            inputFormControl.setValidators(null);
        }
    }

    public onSubmit(form) {
        this.anyCategorySelected = this.areAnyCategoriesSelected();
        this.isSubmitted = true;
        if (form.valid && this.anyCategorySelected) {
            // Do Something
        } else {
            // Do something else
        }
    }

    // TODO: May need to move into the service
    private areAnyCategoriesSelected(): boolean {
        let result = this.createGroupService.categories.find((category) => {
            return category.selected === true;
        });

        return result != null;
    }

    public back() {
        this.locationService.back();
    }
}
