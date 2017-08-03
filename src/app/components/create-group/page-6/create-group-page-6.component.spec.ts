import { Observable } from 'rxjs/Rx';
import { MockTestData } from '../../../shared/MockTestData';
import { MockComponent } from '../../../shared/mock.component';
import { Group } from '../../../models/group';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LookupService } from '../../../services/lookup.service';
import { Router } from '@angular/router';
import { CreateGroupService } from '../create-group-data.service';
import { StateService } from '../../../services/state.service';
import { BlandPageService } from '../../../services/bland-page.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreateGroupPage6Component } from './create-group-page-6.component';

describe('CreateGroupPage6Component', () => {
    let fixture: ComponentFixture<CreateGroupPage6Component>;
    let comp: CreateGroupPage6Component;
    let el;
    let mockBlandPageService, mockState, mockCreateGroupService, mockRouter, mockLookupService, mockLocationService;
    let profileData;
    beforeEach(() => {
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('bps', ['goToDefaultError']);
        mockState = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader']);
        mockCreateGroupService = {profileData: MockTestData.getProfileData(1), group: Group.overload_Constructor_CreateGroup(1), initializePageSix: jasmine.createSpy('initPageSix')};
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
        mockLookupService = jasmine.createSpyObj<LookupService>('lookup', ['getSites']);
        mockCreateGroupService.group = Group.overload_Constructor_CreateGroup(1);
        //profileData = MockTestData.getProfileData(1);
        //mockCreateGroupService.profileData = profileData;
        TestBed.configureTestingModule({
            declarations: [
                CreateGroupPage6Component,
                MockComponent({selector: 'crds-content-block', inputs: ['id']})
            ],
            providers: [
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: StateService, useValue: mockState },
                { provide: CreateGroupService, useValue: mockCreateGroupService },
                { provide: Router, useValue: mockRouter },
                { provide: LookupService, useValue: mockLookupService },
                { provide: LookupService, useValue: mockLookupService },
                FormBuilder
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CreateGroupPage6Component);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    });

    it('should init successfully', () => {
        mockLookupService.getSites.and.returnValue(Observable.of(MockTestData.getSitesList()));
        mockCreateGroupService.initializePageSix.and.returnValue(Observable.of({}));
        comp.ngOnInit();
        expect(mockState.setPageHeader).toHaveBeenCalledWith('start a group', '/create-group/page-5');
        expect(mockLookupService.getSites).toHaveBeenCalled();
        expect(mockCreateGroupService.initializePageSix).toHaveBeenCalled();
        expect(mockBlandPageService.goToDefaultError).not.toHaveBeenCalled();
    });

    it('should init and handle error', () => {
        mockLookupService.getSites.and.returnValue(Observable.of(MockTestData.getSitesList()));
        mockCreateGroupService.initializePageSix.and.returnValue(Observable.throw({error: 'dangDude'}));
        comp.ngOnInit();
        expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledTimes(1);
        expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('/create-group/page-5');
        expect(mockState.setLoading).not.toHaveBeenCalled();
    });

    it('should go back', () => {
        comp.onBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-group/page-5']);
    });

    it('should submit if form is valid', () => {
        let form = new FormGroup({});
        comp['onSubmit'](form);
        expect(comp['createGroupService'].group.congregationId).toBe(mockCreateGroupService.profileData.congregationId);
        expect(mockState.setLoading).toHaveBeenCalledTimes(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-group/preview']);
        expect(mockState.setLoading).toHaveBeenCalledTimes(1);
    });

    it('should not submit if form is not valid', () => {
        let form = new FormGroup({
            whatever: new FormControl('', Validators.required)
        });
        comp['onSubmit'](form);
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        expect(comp['groupVisabilityInvalid']).toBeTruthy();
        expect(mockState.setLoading).toHaveBeenCalledTimes(2);
    });
});
