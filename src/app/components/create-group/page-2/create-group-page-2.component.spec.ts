import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';

import { BlandPageService } from '../../../services/bland-page.service';
import { Group } from '../../../models';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';
import { MockComponent } from '../../../shared/mock.component';
import { CreateGroupService } from '../create-group-data.service';
import { CreateGroupPage2Component } from './create-group-page-2.component';

describe('CreateGroupPage2Component', () => {
    let fixture: ComponentFixture<CreateGroupPage2Component>;
    let comp: CreateGroupPage2Component;
    let el;
    let mockState, mockRouter, mockLocationService, mockLookupService, mockBlandPageService;
    let mockCreateGroupService: CreateGroupService;
    let daysOfTheWeek = [
        { dp_RecordID: 1, dp_RecordName: 'Sunday' },
        { dp_RecordID: 2, dp_RecordName: 'Monday' },
        { dp_RecordID: 3, dp_RecordName: 'Nope' }
    ];

    beforeEach(() => {
        mockState = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader']);
        mockCreateGroupService = <CreateGroupService>{ meetingTimeType: 'specific', group: Group.overload_Constructor_One(0, []) },
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
        mockLocationService = jasmine.createSpyObj<Location>('locationService', ['back']);
        mockLookupService = jasmine.createSpyObj<LookupService>('lookup', ['getDaysOfTheWeek']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('bps', ['goToDefaultError']);
        (mockLookupService.getDaysOfTheWeek).and.returnValue(Observable.of(daysOfTheWeek));
        TestBed.configureTestingModule({
            declarations: [
                CreateGroupPage2Component,
                MockComponent({selector: 'crds-content-block', inputs: ['id']}),
                MockComponent({selector: 'timepicker', inputs: ['ngModel', 'showMeridian', 'minuteStep', 'formControlName'] })
            ],
            providers: [
                { provide: StateService, useValue: mockState },
                { provide: CreateGroupService, useValue: mockCreateGroupService },
                { provide: Router, useValue: mockRouter },
                { provide: Location, useValue: mockLocationService },
                { provide: LookupService, useValue: mockLookupService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                FormBuilder
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CreateGroupPage2Component);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('Should create an instance', () => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    });

    it('should init properly', () => {
        comp.ngOnInit();
        expect(mockLookupService.getDaysOfTheWeek).toHaveBeenCalled();
        expect(mockState.setLoading).toHaveBeenCalledTimes(1);
        expect(comp['daysOfTheWeek']).toEqual(daysOfTheWeek);
        expect(mockState.setPageHeader).toHaveBeenCalledWith('start a group', '/create-group/page-1');
    });

    it('init should handle error', () => {
        (mockLookupService.getDaysOfTheWeek).and.returnValue(Observable.throw({}));
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
        comp.back();
        expect(mockLocationService.back).toHaveBeenCalled();
    });
});
