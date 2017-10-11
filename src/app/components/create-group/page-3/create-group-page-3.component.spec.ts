import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Group } from '../../../models/group';
import { GroupInquiryService } from '../../../services/group-inquiry.service';
import { StateService } from '../../../services/state.service';
import { MockComponent } from '../../../shared/mock.component';
import { MockTestData } from '../../../shared/MockTestData';
import { CreateGroupService } from '../create-group-data.service';
import { CreateGroupPage3Component } from './create-group-page-3.component';

import { textConstants } from '../../../shared/constants';

describe('CreateGroupPage3Component', () => {
  let fixture: ComponentFixture<CreateGroupPage3Component>;
  let mockGroupInquiryService: GroupInquiryService;
  let comp: CreateGroupPage3Component;
  let el;
  let mockState, mockCreateGroupService, mockRouter, mockLocationService;

  beforeEach(() => {
    mockState = jasmine.createSpyObj<StateService>('state', [
      'setLoading',
      'setPageHeader',
      'setActiveGroupPath',
      'getActiveGroupPath'
    ]);
    mockCreateGroupService = jasmine.createSpyObj<GroupInquiryService>('createGroupService', ['navigateInGroupFlow']);
    mockCreateGroupService.group = Group.overload_Constructor_CreateGroup(1);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [CreateGroupPage3Component, MockComponent({ selector: 'crds-content-block', inputs: ['id'] })],
      providers: [
        FormBuilder,
        { provide: StateService, useValue: mockState },
        { provide: CreateGroupService, useValue: mockCreateGroupService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(
    async(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(CreateGroupPage3Component);
        comp = fixture.componentInstance;
      });
    })
  );

  it('should create an instance', () => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should init (isVirtualGroup set to true)', () => {
    comp['createGroupService'].group.isVirtualGroup = true;
    spyOn(comp, 'setRequiredFields');
    spyOn(comp, 'makeSureModelHasAddress');
    comp.ngOnInit();
    expect(comp.locationForm.controls['isVirtualGroup']).toBeTruthy();
    expect(mockState.setPageHeader).toHaveBeenCalledWith(textConstants.GROUP_PAGE_HEADERS.ADD, '/create-group/page-2');
    expect(comp['setRequiredFields']).toHaveBeenCalledWith(true);
    expect(mockState.setLoading).toHaveBeenCalledWith(false);
    expect(comp['makeSureModelHasAddress']).toHaveBeenCalled();
  });

  it('should init (isVirtualGroup set to false)', () => {
    comp['createGroupService'].group.isVirtualGroup = false;
    spyOn(comp, 'setRequiredFields');
    spyOn(comp, 'makeSureModelHasAddress');
    comp.ngOnInit();
    expect(comp.locationForm.controls['isVirtualGroup']).toBeTruthy();
    expect(mockState.setPageHeader).toHaveBeenCalledWith(textConstants.GROUP_PAGE_HEADERS.ADD, '/create-group/page-2');
    expect(comp['setRequiredFields']).toHaveBeenCalledWith(false);
    expect(comp['makeSureModelHasAddress']).toHaveBeenCalled();
  });

  it('onClickIsVirtual(true)', () => {
    spyOn(comp, 'setRequiredFields');
    comp['onClickIsVirtual'](true);
    expect(comp['setRequiredFields']).toHaveBeenCalledWith(true);
  });

  it('onClickIsVirtual(false)', () => {
    spyOn(comp, 'setRequiredFields');
    comp['onClickIsVirtual'](false);
    expect(comp['setRequiredFields']).toHaveBeenCalledWith(false);
  });

  it('should set required fields to required', () => {
    comp.ngOnInit();
    comp['setRequiredFields'](false);
    expect(comp.locationForm.controls['address'].validator).toBeTruthy();
    expect(comp.locationForm.controls['kidsWelcome'].validator).toBeTruthy();
  });

  it('should set required fields to not required', () => {
    comp.ngOnInit();
    comp['setRequiredFields'](true);
    expect(comp.locationForm.controls['address'].validator).toBeFalsy();
    expect(comp.locationForm.controls['kidsWelcome'].validator).toBeFalsy();
  });

  it('should set kids welcome to true', () => {
    comp.ngOnInit();
    comp['onClickKidsWelcome'](true);
    expect(comp.locationForm.controls['kidsWelcome'].value).toBeTruthy();
    expect(comp['createGroupService'].group.kidsWelcome).toBeTruthy();
  });

  it('should set kids welcome to false', () => {
    comp.ngOnInit();
    comp['onClickKidsWelcome'](false);
    expect(comp.locationForm.controls['kidsWelcome'].value).toBeFalsy();
    expect(comp['createGroupService'].group.kidsWelcome).toBeFalsy();
  });

  it('should go to next page if the form is valid', () => {
    let form = new FormGroup({});
    comp.onSubmit(form);
    expect(comp['isSubmitted']).toBeTruthy();
    expect(mockCreateGroupService.navigateInGroupFlow).toHaveBeenCalledWith(4, undefined, 0);
  });

  it('should NOT go to next page if the form is valid', () => {
    let form = new FormGroup({ field: new FormControl('', Validators.required) });
    comp.onSubmit(form);
    expect(comp['isSubmitted']).toBeTruthy();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('makeSureModelHasAddress should set an address if model doesnt have one', () => {
    comp['createGroupService'].group.address = null;
    comp['makeSureModelHasAddress']();
    expect(comp['createGroupService'].group.address).not.toBeNull();
  });

  it('makeSureModelHasAddress should set an address if model doesnt have one', () => {
    comp['createGroupService'].group.address = MockTestData.getAnAddress(20);
    comp['makeSureModelHasAddress']();
    expect(comp['createGroupService'].group.address.addressId).toBe(20);
  });

  it('should go back', () => {
    comp.onBack();
    expect(mockCreateGroupService.navigateInGroupFlow).toHaveBeenCalledWith(2, undefined, 0);
  });
});
