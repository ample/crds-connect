import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { LookupService } from '../../../services/lookup.service';
import { StateService } from '../../../services/state.service';
import { MockTestData } from '../../../shared/MockTestData';
import { CreateGroupPage1Component } from './create-group-page-1.component';

describe('CreateGroupPage1Component', () => {
    let fixture: ComponentFixture<CreateGroupPage1Component>;
    let comp: CreateGroupPage1Component;
    let el;
    let mockStateService, mockLookupService;
    let categories;

    beforeEach(() => {
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setPageHeader', 'setLoading']);
        mockLookupService = jasmine.createSpyObj<LookupService>('lookup', ['getCategories']);
        categories = MockTestData.getSomeCategories();
        (mockLookupService.getCategories).and.returnValue(Observable.of(categories));
        TestBed.configureTestingModule({
            declarations: [
                CreateGroupPage1Component
            ],
            providers: [
                { provide: StateService, useValue: mockStateService },
                { provide: LookupService, useValue: mockLookupService }
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
        spyOn(comp, 'initializeCategories');
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    });

    it('should init', () => {
        spyOn(comp, 'initializeCategories');
        comp.ngOnInit();

        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('start a group', '/create-group');
        expect(comp['initializeCategories']).toHaveBeenCalledTimes(1);
        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
        expect(comp['isComponentReady']).toBeFalsy();
    });

    it('should initialize categories', () => {
        comp['initializeCategories']();
        expect(mockLookupService.getCategories).toHaveBeenCalledTimes(1);
        expect(comp['categories']).toBe(categories);
        expect(comp['isComponentReady']).toBeTruthy();
    });

    it('should select a category', () => {
        comp['categories'] = MockTestData.getSomeCategories(1);
        comp.onSelect(comp['categories'][0]);
        expect(comp['categories'][0].selected).toBe(true);
    });
});
