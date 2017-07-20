import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';
import { MockTestData } from '../../../shared/MockTestData';
import { CategoryComponent } from './category.component';
import { Attribute } from '../../../models/attribute';

describe('CategoryComponent', () => {
    let fixture: ComponentFixture<CategoryComponent>;
    let comp: CategoryComponent;
    let mockAppSettingsService, mockFilterService, mockLookupService;
    let categories;

    beforeEach(() => {
        mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettings', ['']);
        mockFilterService      = jasmine.createSpyObj<FilterService>('filterService', ['setFilterStringCategories']);
        mockLookupService      = jasmine.createSpyObj<LookupService>('lookupService', ['getCategories']);
        categories = MockTestData.getSomeCategories();

        TestBed.configureTestingModule({
            declarations: [
                CategoryComponent
            ],
            providers: [
                { provide: AppSettingsService, useValue: mockAppSettingsService },
                { provide: FilterService, useValue: mockFilterService },
                { provide: LookupService, useValue: mockLookupService}
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CategoryComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        spyOn(comp, 'initializeCategories');
        expect(comp).toBeTruthy();
    });

    it('should init', () => {
        spyOn(comp, 'initializeCategories');
        comp.ngOnInit();
        expect(comp['initializeCategories']).toHaveBeenCalledTimes(1);
    });

    it('should call setSelection', () => {
        spyOn(comp, 'setSelection');
        spyOn(comp, 'setFilterString');
        comp.clickToSelect('123');
        expect(comp['setSelection']).toHaveBeenCalledTimes(1);
        expect(comp['setFilterString']).toHaveBeenCalledTimes(1);
    });

    it('should reset', () => {

    });
});
