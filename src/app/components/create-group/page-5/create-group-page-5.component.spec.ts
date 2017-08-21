import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Group } from '../../../models';
import { GroupService} from '../../../services/group.service';
import { StateService } from '../../../services/state.service';
import { MockComponent } from '../../../shared/mock.component';
import { MockTestData } from '../../../shared/MockTestData';
import { CreateGroupService } from '../create-group-data.service';
import { CreateGroupPage5Component } from './create-group-page-5.component';

describe('CreateGroupPage5Component', () => {
  let fixture: ComponentFixture<CreateGroupPage5Component>;
  let comp: CreateGroupPage5Component;
  let mockGroupService: GroupService;
  let el;
  let mockState, mockCreateGroupService, mockRouter;

  beforeEach(() => {
    mockGroupService = jasmine.createSpyObj<GroupService>('groupService', ['navigateInGroupFlow']);
    mockState = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader', 'getActiveGroupPath']);
    mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('createGroupService', ['addAgeRangesToGroupModel']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    mockCreateGroupService.group = Group.overload_Constructor_CreateGroup(1);
    TestBed.configureTestingModule({
      declarations: [
        CreateGroupPage5Component,
        MockComponent({selector: 'crds-content-block', inputs: ['id']})
      ],
      providers: [
        FormBuilder,
        { provide: GroupService, useValue: mockGroupService },
        { provide: StateService, useValue: mockState },
        { provide: CreateGroupService, useValue: mockCreateGroupService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(CreateGroupPage5Component);
      comp = fixture.componentInstance;
    });
  }));

  it('should get an instance', () => {
    fixture.detectChanges();
    expect(comp).toBeDefined();
  });

  it('should init', () => {
    comp.ngOnInit();
    expect(comp.groupDetailsForm.controls).toBeDefined();
    expect(mockState.setLoading).toHaveBeenCalledWith(false);
  });

  it('form field contents should be invalid before user input', () => {
    comp.ngOnInit();
    expect(comp.groupDetailsForm.controls['groupName'].valid).toBe(false);
    expect(comp.groupDetailsForm.controls['groupDescription'].valid).toBe(false);
    expect(comp.groupDetailsForm.controls['availableOnline'].valid).toBe(false);
  });

  it('setGroupPrivacy should set available online to true', () => {
    comp['groupVisabiltityInvalid'] = true;
    comp['onSetGroupPrivacy'](true);
    expect(comp['createGroupService'].group.availableOnline).toBe(true);
  });

  it('setGroupPrivacy should set available online to false', () => {
    comp['groupVisabiltityInvalid'] = true;
    comp['onSetGroupPrivacy'](false);
    expect(comp['createGroupService'].group.availableOnline).toBe(false);
  });

  it('should submit if form is valid and available online is not null', () => {
    comp['createGroupService'].group.availableOnline = true;
    comp['onSubmit'](new FormGroup({}));
    expect(mockState.setLoading).toHaveBeenCalledTimes(1);
      expect(mockGroupService.navigateInGroupFlow).toHaveBeenCalledWith(6, undefined, 0);
  });

  it('should not submit if available online is null', () => {
    comp['onSubmit'](new FormGroup({}));
    expect(mockState.setLoading).toHaveBeenCalledTimes(2);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should not submit if form is invalid', () => {
    let form: FormGroup = new FormGroup({groupName: new FormControl('', Validators.required)});
    comp['onSubmit'](form);
    expect(mockState.setLoading).toHaveBeenCalledTimes(2);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should go back', () => {
    comp.onBack();
    expect(mockGroupService.navigateInGroupFlow).toHaveBeenCalledWith(4, undefined, 0);
  });

});
