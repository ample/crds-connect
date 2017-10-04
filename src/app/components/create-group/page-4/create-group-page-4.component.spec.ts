import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { Attribute, Group } from '../../../models';
import { GroupInquiryService } from '../../../services/group-inquiry.service';
import { BlandPageService } from '../../../services/bland-page.service';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';
import { MockComponent } from '../../../shared/mock.component';
import { MockTestData } from '../../../shared/MockTestData';
import { CreateGroupService } from '../create-group-data.service';
import { CreateGroupPage4Component } from './create-group-page-4.component';

describe('CreateGroupPage4Component', () => {
  let fixture: ComponentFixture<CreateGroupPage4Component>;
  let mockGroupInquiryService: GroupInquiryService;
  let comp: CreateGroupPage4Component;
  let el;
  let mockState, mockCreateGroupService, mockRouter, mockLookupService, mockBlandPageService;

  beforeEach(() => {
    mockGroupInquiryService = jasmine.createSpyObj<GroupInquiryService>('groupService', ['navigateInGroupFlow']);
    mockState = jasmine.createSpyObj<StateService>('state', [
      'setLoading',
      'setPageHeader',
      'setActiveGroupPath',
      'getActiveGroupPath'
    ]);
    mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('createGroupService', [
      'addAgeRangesToGroupModel',
      'addGroupGenderMixTypeToGroupModel'
    ]);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('bps', ['goToDefaultError']);
    mockLookupService = jasmine.createSpyObj<LookupService>('lookupService', [
      'getGroupGenderMixTypes',
      'getAgeRanges'
    ]);
    mockCreateGroupService.selectedGroupGenderMix = Attribute.constructor_create_group();
    mockCreateGroupService.selectedAgeRanges = Array<Attribute>();
    TestBed.configureTestingModule({
      declarations: [CreateGroupPage4Component, MockComponent({ selector: 'crds-content-block', inputs: ['id'] })],
      providers: [
        FormBuilder,
        { provide: GroupInquiryService, useValue: mockGroupInquiryService },
        { provide: StateService, useValue: mockState },
        { provide: CreateGroupService, useValue: mockCreateGroupService },
        { provide: Router, useValue: mockRouter },
        { provide: LookupService, useValue: mockLookupService },
        { provide: BlandPageService, useValue: mockBlandPageService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(
    async(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(CreateGroupPage4Component);
        comp = fixture.componentInstance;
      });
    })
  );

  it('should get an instance', () => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should init', () => {
    mockLookupService.getGroupGenderMixTypes.and.returnValue(
      Observable.of(MockTestData.getGroupGenderMixAttributeTypeWithAttributes())
    );
    mockLookupService.getAgeRanges.and.returnValue(
      Observable.of(MockTestData.getAgeRangeAttributeTypeWithAttributes())
    );
    spyOn(comp, 'setSelectedAgeRanges');
    spyOn(comp, 'setIsStudentMinistrySelected');
    comp.ngOnInit();
    expect(mockState.setLoading).toHaveBeenCalledWith(false);
    expect(comp['isComponentReady']).toBeTruthy();
    expect(mockLookupService.getGroupGenderMixTypes).toHaveBeenCalledTimes(1);
    expect(mockLookupService.getAgeRanges).toHaveBeenCalledTimes(1);
    expect(comp['setSelectedAgeRanges']).toHaveBeenCalledTimes(1);
    expect(comp['setIsStudentMinistrySelected']).toHaveBeenCalledTimes(1);
  });

  it('init should handle error', () => {
    mockLookupService.getGroupGenderMixTypes.and.returnValue(
      Observable.of(MockTestData.getGroupGenderMixAttributeTypeWithAttributes())
    );
    mockLookupService.getAgeRanges.and.returnValue(Observable.throw({ error: 500 }));
    spyOn(comp, 'setSelectedAgeRanges');
    spyOn(comp, 'setIsStudentMinistrySelected');
    comp.ngOnInit();
    expect(mockState.setLoading).toHaveBeenCalledWith(false);
    expect(comp['isComponentReady']).toBeTruthy();
    expect(mockLookupService.getGroupGenderMixTypes).toHaveBeenCalledTimes(1);
    expect(mockLookupService.getAgeRanges).toHaveBeenCalledTimes(1);
    expect(comp['setSelectedAgeRanges']).not.toHaveBeenCalled();
    expect(comp['setIsStudentMinistrySelected']).not.toHaveBeenCalled();
    expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('/create-group/page-3');
  });

  it('onClickMixType should overwrite what is currently stored in the service and set genderMixInvalid to false', () => {
    let groupGenderMixTypes = MockTestData.getGroupGenderMixAttributeTypeWithAttributes();
    spyOn(comp, 'setSelectedAgeRanges');
    spyOn(comp, 'setIsStudentMinistrySelected');
    mockLookupService.getGroupGenderMixTypes.and.returnValue(Observable.of(groupGenderMixTypes.attributes));
    mockLookupService.getAgeRanges.and.returnValue(
      Observable.of(MockTestData.getAgeRangeAttributeTypeWithAttributes())
    );
    comp.ngOnInit();
    comp['groupGenderMixInvalid'] = true;
    comp['onClickMixType'](groupGenderMixTypes[0]);
    expect(comp['groupGenderMixInvalid']).toBe(false);
    expect(comp['createGroupService'].selectedGroupGenderMix).toBe(groupGenderMixTypes[0]);
  });

  it('setSelectedAgeRanges should mark selected age ranges in component based on service data', () => {
    let ageRanges = MockTestData.getAgeRangeAttributeTypeWithAttributes();
    comp['ageRanges'] = ageRanges.attributes.slice();
    comp['createGroupService'].selectedAgeRanges = ageRanges.attributes.slice(1, 2);
    comp['setSelectedAgeRanges']();
    expect(comp['ageRanges'][1].selected).toBe(true);
    expect(comp['ageRanges'][0].selected).toBeFalsy();
  });

  it('onClickAgeRange should add ageRange to selected list if it is not already selected', () => {
    spyOn(comp, 'setIsStudentMinistrySelected');
    comp['selectedAgeRangesInvalid'] = true;
    comp['createGroupService'].selectedAgeRanges = <Attribute[]>[];
    let ageRanges = MockTestData.getAgeRangeAttributeTypeWithAttributes().attributes;
    comp['ageRanges'] = ageRanges.slice(0);
    comp['onClickAgeRange'](comp['ageRanges'][0]);
    expect(comp['setIsStudentMinistrySelected']).toHaveBeenCalled();
    expect(comp['ageRanges'][0].selected).toBeTruthy();
    expect(comp['createGroupService'].selectedAgeRanges[0].attributeId).toBe(ageRanges[0].attributeId);
    expect(comp['createGroupService'].selectedAgeRanges.length).toBe(1);
    expect(comp['selectedAgeRangesInvalid']).toBe(false);
  });

  it('onClickAgeRange should remove ageRange from selectedList if it is already selected', () => {
    spyOn(comp, 'setIsStudentMinistrySelected');
    comp['selectedAgeRangesInvalid'] = true;
    let ageRanges = MockTestData.getAgeRangeAttributeTypeWithAttributes().attributes;
    comp['ageRanges'] = ageRanges.slice();
    comp['createGroupService'].selectedAgeRanges = ageRanges.slice(0, 1);
    comp['onClickAgeRange'](comp['ageRanges'][0]);
    expect(comp['createGroupService'].selectedAgeRanges.length).toBe(0);
    expect(comp['ageRanges'][0].selected).toBe(false);
    expect(comp['selectedAgeRangesInvalid']).toBeTruthy();
  });

  it('setIsStudentMinsitrySelected should set isStudentMinistrySelected to true if middle school is selected', () => {
    let ageRanges = MockTestData.getAgeRangeAttributeTypeWithAttributes().attributes;
    comp['ageRanges'] = ageRanges.slice();
    comp['createGroupService'].selectedAgeRanges = ageRanges.slice(0, 1);
    comp['setIsStudentMinistrySelected']();
    expect(comp['isStudentMinistrySelected']).toBe(true);
  });

  it('setIsStudentMinsitrySelected should set isStudentMinistrySelected to true if high school is selected', () => {
    let ageRanges = MockTestData.getAgeRangeAttributeTypeWithAttributes().attributes;
    comp['ageRanges'] = ageRanges.slice();
    comp['createGroupService'].selectedAgeRanges = ageRanges.slice(1, 2);
    comp['setIsStudentMinistrySelected']();
    expect(comp['isStudentMinistrySelected']).toBe(true);
  });

  it('setIsStudentMinsitrySelected should set isStudentMinistrySelected to true if middle school and high school is selected', () => {
    let ageRanges = MockTestData.getAgeRangeAttributeTypeWithAttributes().attributes;
    comp['ageRanges'] = ageRanges.slice();
    comp['createGroupService'].selectedAgeRanges = ageRanges.slice(0, 2);
    comp['setIsStudentMinistrySelected']();
    expect(comp['isStudentMinistrySelected']).toBe(true);
  });

  it('setIsStudentMinsitrySelected should set isStudentMinistrySelected to false if middle nor high school are selected', () => {
    let ageRanges = MockTestData.getAgeRangeAttributeTypeWithAttributes().attributes;
    comp['ageRanges'] = ageRanges.slice();
    comp['createGroupService'].selectedAgeRanges = ageRanges.slice(2, 3);
    comp['setIsStudentMinistrySelected']();
    expect(comp['isStudentMinistrySelected']).toBe(false);
  });

  it('should submit for if valid', () => {
    comp['createGroupService'].group = Group.overload_Constructor_CreateGroup(0);
    spyOn(comp, 'validateForm').and.returnValue(true);
    comp['isStudentMinistrySelected'] = true;
    comp['onSubmit'](new FormGroup({}));
    expect(mockCreateGroupService.addAgeRangesToGroupModel).toHaveBeenCalled();
    expect(mockCreateGroupService.addGroupGenderMixTypeToGroupModel).toHaveBeenCalled();
    expect(comp['createGroupService'].group.minorAgeGroupsAdded).toBe(true);
    expect(mockCreateGroupService.navigateInGroupFlow).toHaveBeenCalledWith(5, undefined, 0);
    expect(mockState.setLoading).toHaveBeenCalledTimes(1);
  });

  it('should not submit if invalid', () => {
    comp['createGroupService'].group = Group.overload_Constructor_CreateGroup(0);
    spyOn(comp, 'validateForm').and.returnValue(false);
    comp['isStudentMinistrySelected'] = true;
    comp['onSubmit'](new FormGroup({}));
    expect(mockCreateGroupService.addAgeRangesToGroupModel).not.toHaveBeenCalled();
    expect(mockCreateGroupService.addGroupGenderMixTypeToGroupModel).not.toHaveBeenCalled();
    expect(comp['createGroupService'].group.minorAgeGroupsAdded).toBe(null);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockState.setLoading).toHaveBeenCalledTimes(2);
  });

  it('validate form should return false if selectedGroupGenderMix is not selected', () => {
    let result = comp['validateForm']();
    expect(result).toBe(false);
    expect(comp['groupGenderMixInvalid']).toBe(true);
    expect(comp['selectedAgeRangesInvalid']).toBe(true);
  });

  it('validate form should return false if selected age ranges length is less than 1', () => {
    let genderMixes = MockTestData.getGroupGenderMixAttributeTypeWithAttributes().attributes;
    comp['createGroupService'].selectedGroupGenderMix = genderMixes[0];
    let result = comp['validateForm']();
    expect(result).toBe(false);
    expect(comp['groupGenderMixInvalid']).toBe(false);
    expect(comp['selectedAgeRangesInvalid']).toBe(true);
  });

  it('validate form should return true if everything has valid values', () => {
    let genderMixes = MockTestData.getGroupGenderMixAttributeTypeWithAttributes().attributes;
    let ageRanges = MockTestData.getAgeRangeAttributeTypeWithAttributes().attributes;
    comp['createGroupService'].selectedGroupGenderMix = genderMixes[0];
    comp['createGroupService'].selectedAgeRanges.push(ageRanges[0]);
    let result = comp['validateForm']();
    expect(result).toBe(true);
    expect(comp['groupGenderMixInvalid']).toBe(false);
    expect(comp['selectedAgeRangesInvalid']).toBe(false);
  });

  it('should go back', () => {
    comp['createGroupService'].group = Group.overload_Constructor_CreateGroup(123);
    comp.onBack();
    expect(mockCreateGroupService.navigateInGroupFlow).toHaveBeenCalledWith(3, undefined, 0);
  });
});
