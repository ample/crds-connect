import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { MockComponent } from '../../../shared/mock.component';
import { CreateGroupService } from '../create-group-data.service';
import { CreateGroupPage2Component } from './create-group-page-2.component';

import { BlandPageService } from '../../../services/bland-page.service';
import { GroupInquiryService } from '../../../services/group-inquiry.service';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';

import { Group } from '../../../models';

import {
  meetingFrequencies,
  groupMeetingScheduleType,
  GroupMeetingScheduleType,
  GroupPaths,
  groupPaths,
  GroupPageNumber,
  textConstants
} from '../../../shared/constants';

describe('CreateGroupPage2Component', () => {
  let fixture: ComponentFixture<CreateGroupPage2Component>;
  let mockGroupInquiryService: GroupInquiryService;
  let comp: CreateGroupPage2Component;
  let el;
  let mockState, mockRouter, mockLookupService, mockBlandPageService;
  let mockCreateGroupService: CreateGroupService;
  const daysOfTheWeek = [
    { dp_RecordID: 1, dp_RecordName: 'Sunday' },
    { dp_RecordID: 2, dp_RecordName: 'Monday' },
    { dp_RecordID: 3, dp_RecordName: 'Nope' }
  ];

  beforeEach(() => {
    mockState = jasmine.createSpyObj<StateService>('state', [
      'setLoading',
      'setPageHeader',
      'setActiveGroupPath',
      'getActiveGroupPath'
    ]);
    mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('cgs', [
      'clearMeetingTimeData',
      'navigateInGroupFlow'
    ]);
    mockCreateGroupService.meetingTimeType = 'specific';
    mockCreateGroupService.group = Group.overload_Constructor_CreateGroup(1);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    mockLookupService = jasmine.createSpyObj<LookupService>('lookup', ['getDaysOfTheWeek']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('bps', ['goToDefaultError']);
    mockLookupService.getDaysOfTheWeek.and.returnValue(Observable.of(daysOfTheWeek));
    mockGroupInquiryService = jasmine.createSpyObj<GroupInquiryService>('groupService', ['navigateInGroupFlow']);
    TestBed.configureTestingModule({
      declarations: [
        CreateGroupPage2Component,

        MockComponent({ selector: 'crds-content-block', inputs: ['id'] }),
        MockComponent({
          selector: 'timepicker',
          inputs: ['ngModel', 'showMeridian', 'minuteStep', 'formControlName']
        })
      ],
      providers: [
        { provide: StateService, useValue: mockState },
        { provide: GroupInquiryService, useValue: mockGroupInquiryService },
        { provide: CreateGroupService, useValue: mockCreateGroupService },
        { provide: Router, useValue: mockRouter },
        { provide: LookupService, useValue: mockLookupService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        FormBuilder
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(
    async(() => {
      TestBed.compileComponents().then(() => {
        fixture = TestBed.createComponent(CreateGroupPage2Component);
        comp = fixture.componentInstance;

        // el = fixture.debugElement.query(By.css('h1'));
      });
    })
  );

  it('Should create an instance', () => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should init properly', () => {
    comp.ngOnInit();
    expect(mockLookupService.getDaysOfTheWeek).toHaveBeenCalled();
    expect(mockState.setLoading).toHaveBeenCalledTimes(1);
    expect(comp['daysOfTheWeek']).toEqual(daysOfTheWeek);
    expect(mockState.setPageHeader).toHaveBeenCalledWith(textConstants.GROUP_PAGE_HEADERS.ADD, '/create-group/page-1');
  });

  it('init should handle error', () => {
    mockLookupService.getDaysOfTheWeek.and.returnValue(Observable.throw({}));
    comp.ngOnInit();
    expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('/');
  });

  it('onclick should remove validators if "flexible" is passed in', () => {
    comp.ngOnInit();
    expect(comp.meetingTimeForm.controls['meetingTime'].validator).toBeTruthy();
    comp['onClick']('flexible');
    expect(comp.meetingTimeForm.controls['meetingTime'].validator).toBeFalsy();
  });

  it('onClick should add validators if "specific" is passed in', () => {
    comp.ngOnInit();
    comp['onClick']('specific');
    expect(comp.meetingTimeForm.controls['meetingTime'].validator).toBeTruthy();
  });

  it('should go back', () => {
    comp.onBack();
    expect(mockCreateGroupService.navigateInGroupFlow).toHaveBeenCalledWith(1, undefined, 0);
  });

  it('should submit if valid', () => {
    const form = new FormGroup({});
    comp.date = new Date();
    comp.onSubmit(form);
    expect(mockCreateGroupService.navigateInGroupFlow).toHaveBeenCalledWith(3, undefined, 0);
    expect(mockState.setLoading).toHaveBeenCalledTimes(1);
  });

  it('should not submit if form is invalid', () => {
    let form = new FormGroup({
      stuff: new FormControl('', Validators.required)
    });
    comp.onSubmit(form);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockState.setLoading).toHaveBeenCalledTimes(2);
  });

  it('should update group model when meeting frequency is selected', () => {
    comp['meetingFrequencies'] = meetingFrequencies;
    comp['createGroupService'].group = Group.overload_Constructor_CreateGroup(1);
    comp['onFrequencyChange'](2);
    expect(comp['createGroupService'].group.meetingFrequency).toBe('Every Other Week');
  });

  it('should update group model when meeting day is selected', () => {
    comp['daysOfTheWeek'] = daysOfTheWeek;
    comp['createGroupService'].group = Group.overload_Constructor_CreateGroup(1);
    comp['onDayChange'](3);
    expect(comp['createGroupService'].group.meetingDay).toBe('Nope');
  });
});
