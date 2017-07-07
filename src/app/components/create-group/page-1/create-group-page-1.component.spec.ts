import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';

import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';
import { MockTestData } from '../../../shared/MockTestData';
import { CreateGroupPage1Component } from './create-group-page-1.component';
import { CreateGroupService } from '../create-group-data.service';

describe('CreateGroupPage1Component', () => {
    let fixture: ComponentFixture<CreateGroupPage1Component>;
    let comp: CreateGroupPage1Component;
    let el;
    let mockStateService, mockCreateGroupService;
    let categories;

    beforeEach(() => {
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setPageHeader', 'setLoading']);
        mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('createGroupService', ['initializePageOne']);
        categories = MockTestData.getSomeCategories();
        (mockCreateGroupService.initializePageOne).and.returnValue(Observable.of(categories));
        TestBed.configureTestingModule({
            declarations: [
                CreateGroupPage1Component
            ],
            providers: [
                { provide: StateService, useValue: mockStateService },
                { provide: CreateGroupService, useValue: mockCreateGroupService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CreateGroupPage1Component);
            comp = fixture.componentInstance;
            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should create an instance', () => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    });

    it('should init', () => {
        spyOn(comp, 'initializeCategories');
        comp.ngOnInit();

        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('start a group', '/create-group');
        expect(comp['initializeCategories']).toHaveBeenCalledTimes(1);
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should initialize categories (2 controls for each category)', () => {
        comp.groupCategoryForm = new FormGroup({});
        comp['initializeCategories'](categories);
        categories.forEach((category) => {
            expect(comp.groupCategoryForm.contains(category.name)).toBeTruthy();
            expect(comp.groupCategoryForm.contains(category.name + '-detail')).toBeTruthy();
        });
    });

    it('should select a category', () => {
        comp.groupCategoryForm = new FormGroup({});
        comp['initializeCategories'](categories);
        comp.onSelect(categories[0]);
        expect(categories[0].selected).toBe(true);
    });
});
