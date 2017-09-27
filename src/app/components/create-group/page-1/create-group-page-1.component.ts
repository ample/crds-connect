import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';

import { CreateGroupService } from '../create-group-data.service';
import { GroupService } from '../../../services/group.service';
import { StateService } from '../../../services/state.service';

import { Attribute } from '../../../models/attribute';
import { Category } from '../../../models/category';
import { Group } from '../../../models/group';

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
    private toast: ToastsManager) { }

  ngOnInit() {
    this.setGroupPathInState();
    this.state.setLoading(true);

    this.groupCategoryForm = new FormGroup({});
    this.createGroupService.initializePageOne()
      .finally(() => {
        this.state.setLoading(false);
      })
      .subscribe(cats => {
        this.initializeCategories(cats);
        this.createGroupService.markPageAsPresetWithExistingData(GroupPageNumber.ONE);
      });

    if (this.state.getActiveGroupPath() === groupPaths.EDIT && !this.createGroupService.wasPagePresetWithExistingData.page1) {
      let groupBeingEdited: Group = this.route.snapshot.data['group'];
      this.createGroupService.setGroupFieldsFromGroupBeingEdited(groupBeingEdited);
    }

    let pageHeader = (this.state.getActiveGroupPath() === groupPaths.EDIT) ? textConstants.GROUP_PAGE_HEADERS.EDIT
      : textConstants.GROUP_PAGE_HEADERS.ADD;

    let headerBackRoute: string = (this.state.getActiveGroupPath() === groupPaths.EDIT) ?
      `/small-group/${this.createGroupService.groupBeingEdited.groupId}`
      : '/create-group';

    this.state.setPageHeader(pageHeader, headerBackRoute);
  }

  private initializeCategories(categories: Category[]): void {
    categories.forEach((category) => {
      this.groupCategoryForm.addControl(category.name, new FormControl('', []));
      this.groupCategoryForm.addControl(`${category.name}-detail`, new FormControl('', []));

      if (this.state.getActiveGroupPath() === groupPaths.EDIT
        && !this.createGroupService.wasPagePresetWithExistingData.page1) {
        this.populateFormWithValuesFromGroupBeingEdited(category);
      }
    });

    if (this.state.getActiveGroupPath() === groupPaths.EDIT) {
      this.createGroupService.wasPagePresetWithExistingData.page1 = true;
    }
  }

  public onSelect(category: Category): void {
    (!category.selected) ? this.addCategory(category) : this.removeCategory(category);
    this.areCategoriesValid = this.createGroupService.validateCategories();
  }

  private removeCategory(category: Category) {
    category.selected = false;
    this.removeValidationAndUpdateDeSelectedCategory(category);
  }

  private addCategory(category: Category): void {
    this.createGroupService.validateCategories();
    if (!this.createGroupService.isMaxNumberOfCategoriesSelected()) {
      category.selected = true;
      this.updateValueAndValidityOnSpecificCategory(category);
    } else {
      category.selected = false;
      this.removeValidationAndUpdateDeSelectedCategory(category);
      this.toast.error(this.content.getContent('finderTooManyCategoriesToast'));
    }
  }

  private removeValidationAndUpdateDeSelectedCategory(category: Category): void {
    let inputFormControl = this.groupCategoryForm.controls[`${category.name}-detail`];
    let inputFormControlCheckBox = this.groupCategoryForm.controls[`${category.name}`];
    inputFormControl.setValidators(null);
    inputFormControl.updateValueAndValidity();
    inputFormControlCheckBox.setValue(category.selected);
  }

  private updateValueAndValidityOnSpecificCategory(category: Category): void {
    let inputFormControl = this.groupCategoryForm.controls[`${category.name}-detail`];
    let inputFormControlCheckBox = this.groupCategoryForm.controls[`${category.name}`];
    inputFormControl.setValidators(Validators.required);
    inputFormControl.updateValueAndValidity();
    inputFormControlCheckBox.setValue(category.selected);
  }

  public onSubmit(form, inEditOrCreateMode: string) {
    this.areCategoriesValid = this.createGroupService.validateCategories();
    this.isSubmitted = true;
    this.state.setLoading(true);
    if (form.valid && this.areCategoriesValid) {
      this.createGroupService.addSelectedCategoriesToGroupModel();
      this.groupService.navigateInGroupFlow(GroupPageNumber.TWO, this.state.getActiveGroupPath(), this.createGroupService.group.groupId);
    } else {
      Object.keys(form.controls).forEach((name) => {
        form.controls[name].markAsTouched();
      });
      document.body.scrollIntoView(true);
      this.state.setLoading(false);
    }
  }

  public onCancel(): void {
    this.router.navigate(['/']);
  }

  private setGroupPathInState(): void {
    let pathWithParamsAndChildren: string = this.router.url;
    let path: string = pathWithParamsAndChildren.split('/')[1];
    this.state.setActiveGroupPath(path);
  }

  private populateFormWithValuesFromGroupBeingEdited(category: Category): void {
    let attributesMatchingCat: Attribute[] =
      this.createGroupService.groupBeingEdited.attributeTypes[attributeTypes.GroupCategoryAttributeTypeId.toString()].attributes
        .filter(attribute => attribute.category === category.name
          && attribute.selected === true);

    if (attributesMatchingCat.length > 0) {
      let attribute: Attribute = attributesMatchingCat[0];
      category.selected = true;
      category.categoryDetail = attribute.name;
    }
  }

}
