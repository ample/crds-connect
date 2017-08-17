import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';

import { CreateGroupPage1Component } from './create-group-page-1.component';
import { CreateGroupService } from '../create-group-data.service';
import { GroupService} from '../../../services/group.service';
import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';
import { MockTestData } from '../../../shared/MockTestData';

import { Group } from '../../../models/group';

import { GroupPaths, groupPaths, GroupPageNumber, textConstants } from '../../../shared/constants';

describe('CreateGroupPage1Component', () => {
    let fixture: ComponentFixture<CreateGroupPage1Component>;
    let comp: CreateGroupPage1Component;
    let el;
    let mockStateService, mockCreateGroupService, mockRouter, mockLocationService,
        mockToastsManager, mockGroupService, mockContentService, mockRoute;
    let categories;

    beforeEach(() => {
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setPageHeader', 'setLoading', 'setActiveGroupPath', 'getActiveGroupPath']);
        mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('createGroupService', ['initializePageOne',
                                                     'validateCategories', 'addSelectedCategoriesToGroupModel', 'markPageAsPresetWithExistingData']);
        mockGroupService = jasmine.createSpyObj<GroupService>('groupService', ['navigateInGroupFlow']);
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
        mockLocationService = jasmine.createSpyObj<Location>('locationService', ['back']);
        mockToastsManager = jasmine.createSpyObj<ToastsManager>('toast', ['error']);
        mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);
        categories = MockTestData.getSomeCategories();
        (mockCreateGroupService.initializePageOne).and.returnValue(Observable.of(categories));
        mockRouter = {
            url: '/groupsv2/create-group/page-1', routerState:
            { snapshot:
                { url: '/groupsv2/create-group/page-1',
                  data: {group: Observable.of(Group.overload_Constructor_CreateGroup(123))}}
            }, navigate: jasmine.createSpy('navigate')
        };
        TestBed.configureTestingModule({
            declarations: [
                CreateGroupPage1Component
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { data: { group: Group.overload_Constructor_CreateGroup(123) } } },
                },
                { provide: StateService, useValue: mockStateService },
                { provide: CreateGroupService, useValue: mockCreateGroupService },
                { provide: GroupService, useValue: mockGroupService },
                { provide: Router, useValue: mockRouter },
                { provide: Location, useValue: mockLocationService },
                { provide: ToastsManager, useValue: mockToastsManager },
                { provide: ContentService, useValue: mockContentService }
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

        expect(mockStateService.setPageHeader).toHaveBeenCalledWith(textConstants.GROUP_PAGE_HEADERS.ADD, '/create-group');
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

    it('should add a category', () => {
        (mockCreateGroupService.validateCategories).and.returnValue(true);
        comp.groupCategoryForm = new FormGroup({});
        comp['initializeCategories'](categories);
        comp.onSelect(categories[0]);
        expect(categories[0].selected).toBe(true);
        expect(comp.groupCategoryForm.controls[`${categories[0].name}-detail`].validator).toBeTruthy();
        expect(comp['areCategoriesValid']).toBeTruthy();
    });

    it('should prevent adding a category if there are already 2 selected', () => {
        (mockCreateGroupService.validateCategories).and.returnValue(false);
        (mockContentService.getContent).and.returnValue('MoonUnitTests');
        comp.groupCategoryForm = new FormGroup({});
        comp['initializeCategories'](categories);
        comp.onSelect(categories[0]);
        expect(categories[0].selected).toBe(false);
        expect(mockToastsManager.error).toHaveBeenCalledWith('MoonUnitTests');
    });

    it('should remove a category', () => {
        (mockCreateGroupService.validateCategories).and.returnValue(false);
        comp.groupCategoryForm = new FormGroup({});
        comp['initializeCategories'](categories);
        categories[0].selected = true;
        comp.onSelect(categories[0]);
        expect(categories[0].selected).toBe(false);
        expect(comp.groupCategoryForm.controls[`${categories[0].name}-detail`].validator).toBeFalsy();
    });

    it('should submit the form if valid', () => {
        (mockCreateGroupService.validateCategories).and.returnValue(true);
        comp['createGroupService'].group = Group.overload_Constructor_CreateGroup(123);
        comp.groupCategoryForm = new FormGroup({});
        comp['initializeCategories'](categories);
        comp.onSubmit(comp.groupCategoryForm, groupPaths.ADD);
        expect(comp['isSubmitted']).toBeTruthy();
        expect(comp['areCategoriesValid']).toBeTruthy();
        expect(mockCreateGroupService.validateCategories).toHaveBeenCalled();
        expect(mockCreateGroupService.addSelectedCategoriesToGroupModel).toHaveBeenCalled();
    });

    it('should not submit the from if its not valid', () => {
        (mockCreateGroupService.validateCategories).and.returnValue(false);
        comp.groupCategoryForm = new FormGroup({});
        comp['initializeCategories'](categories);
        comp.onSelect(categories[0]);
        comp.onSubmit(comp.groupCategoryForm, groupPaths.ADD);
        expect(mockCreateGroupService.addSelectedCategoriesToGroupModel).not.toHaveBeenCalled();

    });
});
