import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';
import { MockTestData } from '../../../shared/MockTestData';
import { AgeGroupsComponent } from './age-groups.component';

fdescribe('AgeGroupsComponent', () => {
    let fixture: ComponentFixture<AgeGroupsComponent>;
    let comp: AgeGroupsComponent;
    let el;
    let mockAppSettingsService, mockFilterService, mockLookupService;
    let categories;

    beforeEach(() => {
        mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettings', ['']);
        mockFilterService      = jasmine.createSpyObj<FilterService>('filterService', ['filterStringKidsWelcome']);
        mockLookupService      = jasmine.createSpyObj<LookupService>('lookupService', ['getAgeGroups']);
        categories = MockTestData.getSomeCategories();

        TestBed.configureTestingModule({
            declarations: [
                AgeGroupsComponent
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
            fixture = TestBed.createComponent(AgeGroupsComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        spyOn(comp, 'initializeAgeGroups');
        expect(comp).toBeTruthy();
    });

    it('should init', () => {
        spyOn(comp, 'initializeAgeGroups');
        comp.ngOnInit();
        expect(comp['initializeAgeGroups']).toHaveBeenCalledTimes(1);
    });

    it('should call setSelection', () => {
        spyOn(comp, 'setSelection');
        comp.clickToSelect('123');
        expect(comp['setSelection']).toHaveBeenCalledTimes(1);
    });

});
