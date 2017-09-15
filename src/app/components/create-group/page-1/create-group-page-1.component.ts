import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';

import { CreateGroupService } from '../create-group-data.service';
import { GroupService} from '../../../services/group.service';
import { StateService } from '../../../services/state.service';

import { Attribute } from '../../../models/attribute';
import { Category } from '../../../models/category';
import { Group} from '../../../models/group';

import { attributeTypes, groupPaths, GroupPageNumber, textConstants } from '../../../shared/constants';

@Component({
  selector: 'create-group-page-1',
  templateUrl: './create-group-page-1.component.html',
})
export class CreateGroupPage1Component implements OnInit {
  public groupCategoryForm: FormGroup;
  private isSubmitted: boolean = false;
  private areCategoriesValid: boolean = false;

  constructor(
    private content: ContentService,
    private createGroupService: CreateGroupService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router,
    private state: StateService,
    private toast: ToastsManager){ }

  ngOnInit() {
    this.setGroupPathInState();
    this.state.setLoading(true);

    this.groupCategoryForm = new FormGroup({});
    this.createGroupService.initializePageOne() // Set the categories in service
    .finally(() => {
        this.state.setLoading(false);
    })
    .subscribe(categories => {
      this.initializeCategories(categories);

      if(this.state.getActiveGroupPath() === groupPaths.EDIT
                                          && !this.createGroupService.wasPagePresetWithExistingData.page1) {
        // this.initializeSelectedCategories(categories);
        this.createGroupService.wasPagePresetWithExistingData.page1 = true;
      }

      this.createGroupService.markPageAsPresetWithExistingData(GroupPageNumber.ONE);
    });

    if(this.state.getActiveGroupPath() === groupPaths.EDIT && !this.createGroupService.wasPagePresetWithExistingData.page1) {
      const groupBeingEdited: Group = this.route.snapshot.data['group'];
      this.createGroupService.setGroupFieldsFromGroupBeingEdited(groupBeingEdited);
    }

    this.setPageHeader();
  }

  // ***** Initialization Methods *****
  private setGroupPathInState(): void {
    const pathWithParamsAndChildren: string = this.router.url;
    const path: string = pathWithParamsAndChildren.split('/')[1];
    this.state.setActiveGroupPath(path);
  }

  private initializeCategories(categories: Category[]): void {
    categories.forEach((category) => {
      this.groupCategoryForm.addControl(category.name, new FormControl('', []));
      this.groupCategoryForm.addControl(`${category.name}-detail`, new FormControl('', []));
    });
  }

  private setPageHeader(): void {
    const pageHeader = (this.state.getActiveGroupPath() === groupPaths.EDIT) ? textConstants.GROUP_PAGE_HEADERS.EDIT
      : textConstants.GROUP_PAGE_HEADERS.ADD;

    const headerBackRoute: string = (this.state.getActiveGroupPath() === groupPaths.EDIT) ?
      `/small-group/${this.createGroupService.groupBeingEdited.groupId}`
      : '/create-group';

    this.state.setPageHeader(pageHeader, headerBackRoute);
  }

  // ***** Select Category Methods *****
  public onSelect(category: Category): void {
    if(category.selected) {
      this.removeCategory(category)
    } else if(!this.createGroupService.isMaxNumberOfCategoriesSelected()) {
      this.addCategory(category)
    } else {
      this.toast.error(this.content.getContent('finderTooManyCategoriesToast'))
      // this.setValidators(category, Validators.required);

      const inputFormControlCheckBox = this.groupCategoryForm.controls[`${category.name}`];
      inputFormControlCheckBox.setValue(false);
    }
  }

  private removeCategory(category: Category): void {
    console.log(`In removeCategory`);
    category.selected = false;
    this.createGroupService.deselectCategory(category);
    // this.setValidators(category, null);

    const inputFormControlCheckBox = this.groupCategoryForm.controls[`${category.name}`];
    inputFormControlCheckBox.setValue(false);
  }

  private addCategory(category: Category): void {
    console.log(`In addCategory`);
    category.selected = true;
    this.createGroupService.selectCategory(category);
    // this.setValidators(category, null);
    // this.setValidators(category, Validators.required);

    const inputFormControlCheckBox = this.groupCategoryForm.controls[`${category.name}`];
    inputFormControlCheckBox.setValue(true);
  }

  private setValidators(category: Category, validators: ValidatorFn) {
    const inputFormControl = this.groupCategoryForm.controls[`${category.name}-detail`];
    inputFormControl.setValidators(validators);
    inputFormControl.updateValueAndValidity();
  }

  // ***** Submit Button Method *****
  public onSubmit(form, inEditOrCreateMode: string) {
    this.areCategoriesValid = this.createGroupService.validateCategories();
    this.isSubmitted = true;
    this.state.setLoading(true);
    console.log(`In onSubmit: form.valid: ${form.valid}, areCategoriesValid: ${this.areCategoriesValid}`);
    if (form.valid && this.areCategoriesValid) {
      this.createGroupService.addSelectedCategoriesToGroupModel();
      this.groupService.navigateInGroupFlow(GroupPageNumber.TWO, this.state.getActiveGroupPath(), this.createGroupService.group.groupId);
    } else {
      this.state.setLoading(false);
    }
  }

  // ***** Cancel Button Method *****
  public onCancel(): void {
    this.router.navigate(['/']);
  }
}
