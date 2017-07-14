import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';
import { MockTestData } from '../../../shared/MockTestData';
import { GroupTypeComponent } from './group-type.component';
import { GroupType } from '../../../models/group-type';
import { Attribute } from '../../../models/attribute';

describe('GroupTypeComponent', () => {
    let fixture: ComponentFixture<GroupTypeComponent>;
    let comp: GroupTypeComponent;
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
                GroupTypeComponent
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
            fixture = TestBed.createComponent(GroupTypeComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        spyOn(comp, 'getGroupTypesFromMp');
        expect(comp).toBeTruthy();
    });

    it('should init', () => {
        spyOn(comp, 'getGroupTypesFromMp');
        comp.ngOnInit();
        expect(comp['getGroupTypesFromMp']).toHaveBeenCalledTimes(1);
    });

    it('should call setSelection', () => {
        spyOn(comp, 'setGroupTypeSelection');
        spyOn(comp, 'setFilterStringInFilterService');
        comp.clickToSelect('123');
        expect(comp['setGroupTypeSelection']).toHaveBeenCalledTimes(1);
        expect(comp['setFilterStringInFilterService']).toHaveBeenCalledTimes(1);
    });

    it('should reset', () => {
        let attr = new Attribute(1, 'attr', 'desc', 'cat', 2, 'catdesc', 3, null, null, null);
        let a1 = new GroupType(attr);
        a1.selected = true;
        let a2 = new GroupType(attr);
        a2.selected = true;

        comp['groupTypes'] = [a1, a2];
        comp.reset();

        expect(comp['groupTypes'][0].selected).toBe(false);
        expect(comp['groupTypes'][1].selected).toBe(false);
    });
});
