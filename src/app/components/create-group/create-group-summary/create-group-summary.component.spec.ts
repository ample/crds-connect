import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { Router } from '@angular/router';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {StateService} from '../../../services/state.service';
import {CreateGroupSummaryComponent} from './create-group-summary.component';

import {textConstants} from '../../../shared/constants';
import {CreateGroupService} from "../create-group-data.service";

describe('CreateGroupSummaryComponent', () => {
  let fixture: ComponentFixture<CreateGroupSummaryComponent>;
  let comp: CreateGroupSummaryComponent;
  let el;
  let mockStateService, mockCreateGroupService, mockRouter;

  beforeEach(() => {
    mockStateService = jasmine.createSpyObj<StateService>('state', ['setPageHeader', 'setLoading']);
    mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('createGroupService', ['']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [
        CreateGroupSummaryComponent
      ],
      providers: [
        {provide: StateService, useValue: mockStateService},
        {provide: CreateGroupService, useValue: mockCreateGroupService},
        {provide: Router, useValue: mockRouter}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(CreateGroupSummaryComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should instantiate', () => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should init', () => {
    comp.ngOnInit();
    expect(mockStateService.setPageHeader).toHaveBeenCalledWith(textConstants.GROUP_PAGE_HEADERS.ADD, '/');
    expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
  });
});
