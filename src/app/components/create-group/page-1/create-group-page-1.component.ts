import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
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
  public isSubmitted: boolean = false;
  public areCategoriesValid: boolean = false;

  constructor(
    private content: ContentService,
    public createGroupService: CreateGroupService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router,
    private state: StateService,
    private toast: ToastsManager){ }

  public ngOnInit() {
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

    if(this.state.getActiveGroupPath() === groupPaths.EDIT && !this.createGroupService.wasPagePresetWithExistingData.page1) {
      const groupBeingEdited: Group = this.route.snapshot.data['group'];
      this.createGroupService.setGroupFieldsFromGroupBeingEdited(groupBeingEdited);
    }

    const pageHeader = (this.state.getActiveGroupPath() === groupPaths.EDIT) ? textConstants.GROUP_PAGE_HEADERS.EDIT
      : textConstants.GROUP_PAGE_HEADERS.ADD;

    const headerBackRoute: string = (this.state.getActiveGroupPath() === groupPaths.EDIT) ?
      `/small-group/${this.createGroupService.groupBeingEdited.groupId}`
      :'/create-group';

    this.state.setPageHeader(pageHeader, headerBackRoute);
  }

  private initializeCategories(categories: Category[]): void {
    categories.forEach((category) => {
      this.groupCategoryForm.addControl(category.name, new FormControl('', []));
      this.groupCategoryForm.addControl(`${category.name}-detail`, new FormControl('', []));

      if(this.state.getActiveGroupPath() === groupPaths.EDIT
                                          && !this.createGroupService.wasPagePresetWithExistingData.page1) {
        this.populateFormWithValuesFromGroupBeingEdited(category);
      }
    });

    if(this.state.getActiveGroupPath() === groupPaths.EDIT){
      this.createGroupService.wasPagePresetWithExistingData.page1 = true;
    }
  }

  public onSelect(category: Category): void {
    (!category.selected) ? this.addCategory(category) : this.removeCategory(category);
    this.areCategoriesValid = this.createGroupService.validateCategories();
  }

  private removeCategory(category: Category) {
    category.selected = false;
    const inputFormControl = this.groupCategoryForm.controls[`${category.name}-detail`];
    inputFormControl.setValidators(null);
    inputFormControl.updateValueAndValidity();
  }

  private addCategory(category: Category): void {
    if (!this.createGroupService.isMaxNumberOfCategoriesSelected()) {
      category.selected = true;
    } else {
      category.selected = false;
      this.toast.error(this.content.getContent('finderTooManyCategoriesToast'));
    }
    this.updateValueAndValidityOnSpecificCategory(category);
  }

  private updateValueAndValidityOnSpecificCategory(category: Category): void {
    const inputFormControl = this.groupCategoryForm.controls[`${category.name}-detail`];
    const inputFormControlCheckBox = this.groupCategoryForm.controls[`${category.name}`];
    inputFormControl.setValidators(Validators.required);
    inputFormControl.updateValueAndValidity();
    inputFormControlCheckBox.setValidators(Validators.required);
    inputFormControlCheckBox.setValue(category.selected);
  }

  public onSubmit(form) {
    this.areCategoriesValid = this.createGroupService.validateCategories();
    this.isSubmitted = true;
    this.state.setLoading(true);
    if (form.valid && this.areCategoriesValid) {
        this.createGroupService.addSelectedCategoriesToGroupModel();
        this.groupService.navigateInGroupFlow(GroupPageNumber.TWO, this.state.getActiveGroupPath(), this.createGroupService.group.groupId);
    } else {
        this.state.setLoading(false);
    }
  }

  public onCancel(): void {
    this.router.navigate(['/']);
  }

  private setGroupPathInState(): void {
    const pathWithParamsAndChildren: string = this.router.url;
    const path: string = pathWithParamsAndChildren.split('/')[1];
    this.state.setActiveGroupPath(path);
  }

  private populateFormWithValuesFromGroupBeingEdited (category: Category): void {
    const attributesMatchingCat: Attribute[] =
      this.createGroupService.groupBeingEdited.attributeTypes[attributeTypes.GroupCategoryAttributeTypeId.toString()].attributes
        .filter(attribute => attribute.category === category.name
                             && attribute.selected === true);

    if(attributesMatchingCat.length > 0){
      const attribute: Attribute = attributesMatchingCat[0];
      category.selected = true;
      category.categoryDetail = attribute.name;
    }
  }

}
