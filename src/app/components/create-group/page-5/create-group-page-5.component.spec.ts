import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Group } from '../../../models';
import { StateService } from '../../../services/state.service';
import { MockComponent } from '../../../shared/mock.component';
import { MockTestData } from '../../../shared/MockTestData';
import { CreateGroupService } from '../create-group-data.service';
import { CreateGroupPage5Component } from './create-group-page-5.component';

describe('CreateGroupPage5Component', () => {
    let fixture: ComponentFixture<CreateGroupPage5Component>;
    let comp: CreateGroupPage5Component;
    let el;
    let mockStateService, mockCreateGroupService, mockRouter;

    beforeEach(() => {
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader']);
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
                { provide: StateService, useValue: mockStateService },
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
        expect(comp).toBeTruthy();
    });

    it('should init', () => {
        comp.ngOnInit();
        expect(comp.groupDetailsForm.controls).toBeTruthy();
        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    });

    it('onClick should set available online to true', () => {
        comp['groupVisabiltityInvalid'] = true;
        comp['onClick'](true);
        expect(comp['createGroupService'].group.availableOnline).toBe(true);
        expect(comp['groupVisibilityInvalid']).toBe(false);
    });

    it('onClick should set available online to false', () => {
        comp['groupVisabiltityInvalid'] = true;
        comp['onClick'](false);
        expect(comp['createGroupService'].group.availableOnline).toBe(false);
        expect(comp['groupVisibilityInvalid']).toBe(false);
    });

    it('should submit if form is valid and available online is not null', () => {
        comp['createGroupService'].group.availableOnline = true;
        comp['onSubmit'](new FormGroup({}));
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-group/page-6']);
    });

    it('should not submit if available online is null', () => {
        comp['onSubmit'](new FormGroup({}));
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should not submit if form is invalid', () => {
        let form: FormGroup = new FormGroup({groupName: new FormControl('', Validators.required)});
        comp['onSubmit'](form);
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should go back', () => {
        comp.onBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-group/page-4']);
    });

});
