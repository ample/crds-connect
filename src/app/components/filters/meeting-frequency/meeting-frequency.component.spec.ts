import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';
import { MockTestData } from '../../../shared/MockTestData';
import { MeetingFrequencyComponent } from './meeting-frequency.component';

import { AgeGroup } from '../../../models/age-group';
import { Attribute } from '../../../models/attribute';
import { SimpleSelectable} from '../../../models/simple-selectable';

describe('MeetingFrequencyComponent', () => {
    let fixture: ComponentFixture<MeetingFrequencyComponent>;
    let comp: MeetingFrequencyComponent;
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
                MeetingFrequencyComponent
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
            fixture = TestBed.createComponent(MeetingFrequencyComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should call setSelection', () => {
        spyOn(comp, 'onClickToSelect');
        comp.onClickToSelect(new SimpleSelectable('Every Week'));
        expect(comp['onClickToSelect']).toHaveBeenCalledTimes(1);
    });

    it('should reset', () => {
        comp.selectableMeetingFrequencies = [new SimpleSelectable('Every Week')];
        comp.selectableMeetingFrequencies[0].isSelected = true;

        comp.reset();

        expect(comp.selectableMeetingFrequencies[0].isSelected ).toBe(false);
    });
});
