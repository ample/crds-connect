import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';

import { Category } from '../../../models/category';
import { CreateGroupService } from '../create-group-data.service';
import { StateService } from '../../../services/state.service';


@Component({
    selector: 'create-group-page-1',
    templateUrl: './create-group-page-1.component.html',
})
export class CreateGroupPage1Component implements OnInit {
    public groupCategoryForm: FormGroup;
    private isSubmitted: boolean = false;
    private areCategoriesValid: boolean = false;

    constructor(private state: StateService,
                private createGroupService: CreateGroupService,
                private router: Router,
                private locationService: Location,
                private toast: ToastsManager,
                private content: ContentService) { }

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
        (!category.selected) ? this.addCategory(category) : this.removeCategory(category);
        this.areCategoriesValid = this.createGroupService.validateCategories();
    }

    private removeCategory(category: Category) {
        category.selected = false;
        let inputFormControl = this.groupCategoryForm.controls[`${category.name}-detail`];
        inputFormControl.setValidators(null);
        inputFormControl.updateValueAndValidity();
    }

    private addCategory(category: Category) {
        category.selected = true;
        if (this.createGroupService.validateCategories()) {
            let inputFormControl = this.groupCategoryForm.controls[`${category.name}-detail`];
            inputFormControl.setValidators(Validators.required);
            inputFormControl.updateValueAndValidity();
        } else {
            category.selected = false;
            this.toast.error(this.content.getContent('finderTooManyCategoriesToast'));
        }
    }

    public onSubmit(form) {
        this.areCategoriesValid = this.createGroupService.validateCategories();
        this.isSubmitted = true;
        this.state.setLoading(true);
        if (form.valid && this.areCategoriesValid) {
            this.createGroupService.addSelectedCategoriesToGroupModel();
            this.router.navigate(['/create-group/page-2']);
        } else {
            this.state.setLoading(false);
        }
    }

    public onCancel() {
        this.router.navigate(['/']);
    }

    public onBack(): void {
        this.router.navigate(['/create-group']);
    }

}
