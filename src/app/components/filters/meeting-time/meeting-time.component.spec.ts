import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';
import { MockTestData } from '../../../shared/MockTestData';
import { MeetingTimeComponent } from './meeting-time.component';
import { AgeGroup } from '../../../models/age-group';
import { Attribute } from '../../../models/attribute';

describe('MeetingTimeComponent', () => {
    let fixture: ComponentFixture<MeetingTimeComponent>;
    let comp: MeetingTimeComponent;
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
                MeetingTimeComponent
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
            fixture = TestBed.createComponent(MeetingTimeComponent);
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
        spyOn(comp, 'setFilterString');
        comp.clickToSelect('123');
        expect(comp['setSelection']).toHaveBeenCalledTimes(1);
        expect(comp['setFilterString']).toHaveBeenCalledTimes(1);
    });

    it('should reset', () => {
        let attr = new Attribute(1, 'attr', 'desc', 'cat', 2, 'catdesc', 3, 1, null, null);
        let a1 = new AgeGroup(attr);
        a1.selected = true;
        let a2 = new AgeGroup(attr);
        a2.selected = true;

        comp['ageGroups'] = [a1, a2];
        comp.reset();

        expect(comp['ageGroups'][0].selected).toBe(false);
        expect(comp['ageGroups'][1].selected).toBe(false);
    });
});
