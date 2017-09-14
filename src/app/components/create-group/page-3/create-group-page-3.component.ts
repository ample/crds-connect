import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {Address} from '../../../models';
import {GroupService} from '../../../services/group.service';
import {StateService} from '../../../services/state.service';
import {CreateGroupService} from '../create-group-data.service';
import {
  meetingFrequencies, usStatesList, GroupPaths, groupPaths,
  GroupPageNumber, textConstants
} from '../../../shared/constants';


@Component({
  selector: 'create-group-page-3',
  templateUrl: './create-group-page-3.component.html',
})
export class CreateGroupPage3Component implements OnInit {
  public locationForm: FormGroup;
  private usStatesList: string[] = usStatesList;
  private isSubmitted: boolean = false;
  private isAddressInitializedInEdit: boolean = false;

  private meetingFrequencies: Array<any> = meetingFrequencies;

  constructor(private fb: FormBuilder,
              private groupService: GroupService,
              private state: StateService,
              private createGroupService: CreateGroupService,
              private router: Router) {
  }

  ngOnInit() {
    let pageHeader = (this.state.getActiveGroupPath() === groupPaths.EDIT) ? textConstants.GROUP_PAGE_HEADERS.EDIT
      : textConstants.GROUP_PAGE_HEADERS.ADD;
    let headerBackRoute: string = (this.state.getActiveGroupPath() === groupPaths.EDIT) ?
      `/edit-group/${this.createGroupService.groupBeingEdited.groupId}/page-2`
      : '/create-group/page-2';

    this.state.setPageHeader(pageHeader, headerBackRoute);

    this.makeSureModelHasAddress();
    this.locationForm = this.fb.group({
      isVirtualGroup: [this.createGroupService.group.isVirtualGroup],
      address: [this.createGroupService.group.address.addressLine1],
      city: [this.createGroupService.group.address.city],
      state: [this.createGroupService.group.address.state],
      zip: [this.createGroupService.group.address.zip],
      kidsWelcome: [this.createGroupService.group.kidsWelcome]
    });
    this.setRequiredFields(this.createGroupService.group.isVirtualGroup);

    if (this.state.getActiveGroupPath() === groupPaths.EDIT
      && !this.createGroupService.wasPagePresetWithExistingData.page3) {
      this.setFieldsFromExistingGroup();
    }

    this.isAddressInitializedInEdit = !!this.createGroupService.group.address;

    this.state.setLoading(false);

  }

  private initializeAddressIfInEditAndNotInitialized(isVirtual: boolean): void {
    if (this.state.getActiveGroupPath() === groupPaths.EDIT && !this.isAddressInitializedInEdit) {
      if (isVirtual === false) {
        this.createGroupService.group.address = Address.overload_Constructor_One();
        this.isAddressInitializedInEdit = true;
      }
    }
  }

  private onClickIsVirtual(isVirtual: boolean): void {

    this.initializeAddressIfInEditAndNotInitialized(isVirtual);

    this.createGroupService.group.isVirtualGroup = isVirtual;
    this.setRequiredFields(isVirtual);
  }

  private makeSureModelHasAddress(): void {
    if (this.createGroupService.group.address == null) {
      this.createGroupService.group.address = Address.overload_Constructor_One();
    }
  }

  private setRequiredFields(required: boolean): void {
    if (!required) {
      this.locationForm.controls['address'].setValidators(Validators.required);
      this.locationForm.controls['city'].setValidators(Validators.required);
      this.locationForm.controls['state'].setValidators(Validators.required);
      this.locationForm.controls['zip'].setValidators(Validators.required);
      this.locationForm.controls['kidsWelcome'].setValidators(Validators.required);
    } else {
      this.locationForm.controls['address'].setValidators(null);
      this.locationForm.controls['city'].setValidators(null);
      this.locationForm.controls['state'].setValidators(null);
      this.locationForm.controls['zip'].setValidators(null);
      this.locationForm.controls['kidsWelcome'].setValidators(null);
    }

    this.locationForm.controls['address'].updateValueAndValidity();
    this.locationForm.controls['city'].updateValueAndValidity();
    this.locationForm.controls['state'].updateValueAndValidity();
    this.locationForm.controls['zip'].updateValueAndValidity();
    this.locationForm.controls['kidsWelcome'].updateValueAndValidity();
  }

  private onClickKidsWelcome(value: boolean): void {
    this.locationForm.controls['kidsWelcome'].setValue(value);
    this.createGroupService.group.kidsWelcome = value;
  }


  public onSubmit(form: FormGroup): void {
    this.isSubmitted = true;
    if (form.valid) {
      if (this.createGroupService.group.isVirtualGroup) {
        this.createGroupService.group.address = Address.overload_Constructor_One();
      }
      this.groupService.navigateInGroupFlow(GroupPageNumber.FOUR, this.state.getActiveGroupPath(), this.createGroupService.group.groupId);
    } else {
      Object.keys(form.controls).forEach((name) => {
        form.controls[name].markAsTouched();
      });
    }
  }

  public onBack(): void {
    this.groupService.navigateInGroupFlow(GroupPageNumber.TWO, this.state.getActiveGroupPath(), this.createGroupService.group.groupId);
  }

  private setFieldsFromExistingGroup(): void {
    let isGroupVirtual: boolean = this.createGroupService.groupBeingEdited.address === null
      || this.createGroupService.groupBeingEdited.address.addressLine1 === null;

    if (isGroupVirtual) {
      this.onClickIsVirtual(true);
    }
    this.createGroupService.group.address = this.createGroupService.groupBeingEdited.address;
    this.onClickKidsWelcome(this.createGroupService.groupBeingEdited.kidsWelcome);

    this.createGroupService.wasPagePresetWithExistingData.page3 = true;
  }
}
