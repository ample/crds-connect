import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Group } from '../../../models/group';
import { StateService } from '../../../services/state.service';
import { MockComponent } from '../../../shared/mock.component';
import { CreateGroupService } from '../create-group-data.service';
import { CreateGroupPage3Component } from './create-group-page-3.component';

describe('CreateGroupPage3Component', () => {
    let fixture: ComponentFixture<CreateGroupPage3Component>;
    let comp: CreateGroupPage3Component;
    let el;
    let mockStateService, mockCreateGroupService, mockRouter, mockLocationService;

    beforeEach(() => {
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader']);
        mockCreateGroupService = <CreateGroupService>{ group: Group.overload_Constructor_CreateGroup(1), meetingIsInPerson: false };
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
        mockLocationService = jasmine.createSpyObj<Location>('locationService', ['back']);
        TestBed.configureTestingModule({
            declarations: [
                CreateGroupPage3Component,
                MockComponent({selector: 'crds-content-block', inputs: ['id']})
            ],
            providers: [
                FormBuilder,
                { provide: StateService, useValue: mockStateService },
                { provide: CreateGroupService, useValue: mockCreateGroupService },
                { provide: Router, useValue: mockRouter },
                { provide: Location, useValue: mockLocationService }

            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CreateGroupPage3Component);
            comp = fixture.componentInstance;
        });
    }));

    fit('should create an instance', () => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    });

    fit('should init (meetingIsInPerson set to false)', () => {
        spyOn(comp, 'setRequiredFields');
        comp.ngOnInit();
        expect(comp.locationForm.controls['isInPerson']).toBeTruthy();
        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('start a group', '/create-group/page-2');
        expect(comp['setRequiredFields']).toHaveBeenCalledWith(false);
        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    });

    fit('should init (meetingIsInPerson set to true)', () => {
        comp['createGroupService'].meetingIsInPerson = true;
        spyOn(comp, 'setRequiredFields');
        comp.ngOnInit();
        expect(comp.locationForm.controls['isInPerson']).toBeTruthy();
        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('start a group', '/create-group/page-2');
        expect(comp['setRequiredFields']).toHaveBeenCalledWith(true);
    });

    fit('onClickIsOnline(true)', () => {
        spyOn(comp, 'setRequiredFields');
        comp['onClickIsOnline'](true);
        expect(comp['setRequiredFields']).toHaveBeenCalledWith(true);
    });

    fit('onClickIsOnline(false)', () => {
        spyOn(comp, 'setRequiredFields');
        comp['onClickIsOnline'](false);
        expect(comp['setRequiredFields']).toHaveBeenCalledWith(false);
    });

    fit('should set required fields to required', () => {
        comp.ngOnInit();
        comp['setRequiredFields'](true);
        expect(comp.locationForm.controls['address'].validator).toBeTruthy();
        expect(comp.locationForm.controls['kidsWelcome'].validator).toBeTruthy();
    });

    fit('should set required fields to not required', () => {
        comp.ngOnInit();
        comp['setRequiredFields'](false);
        expect(comp.locationForm.controls['address'].validator).toBeFalsy();
        expect(comp.locationForm.controls['kidsWelcome'].validator).toBeFalsy();
    });

    fit('should set kids welcome to true', () => {
        comp.ngOnInit();
        comp['onClickKidsWelcome'](true);
        expect(comp.locationForm.controls['kidsWelcome'].value).toBeTruthy();
        expect(comp['createGroupService'].group.kidsWelcome).toBeTruthy();
    });

    fit('should set kids welcome to false', () => {
        comp.ngOnInit();
        comp['onClickKidsWelcome'](false);
        expect(comp.locationForm.controls['kidsWelcome'].value).toBeFalsy();
        expect(comp['createGroupService'].group.kidsWelcome).toBeFalsy();
    });

    fit('should go to next page if the form is valid', () => {
        comp.ngOnInit();
        comp['setRequiredFields'](false);
        comp.onSubmit(comp.locationForm);
        expect(comp['isSubmitted']).toBeTruthy();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-group/page-4']);
    });

    fit('should NOT go to next page if the form is valid', () => {
        comp.ngOnInit();
        comp['setRequiredFields'](true);
        comp.onSubmit(comp.locationForm);
        expect(comp['isSubmitted']).toBeTruthy();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
});
