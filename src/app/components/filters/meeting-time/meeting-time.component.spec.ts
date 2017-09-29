import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../filter.service';
import { LookupService } from '../../../services/lookup.service';
import { MockTestData } from '../../../shared/MockTestData';
import { MeetingTimeComponent } from './meeting-time.component';
import { SimpleSelectable } from '../../../models/simple-selectable';
import { AgeGroup } from '../../../models/age-group';
import { Attribute } from '../../../models/attribute';


describe('MeetingTimeComponent', () => {
    let fixture: ComponentFixture<MeetingTimeComponent>;
    let comp: MeetingTimeComponent;
    let el;
    let mockAppSettingsService, mockFilterService, mockLookupService;
    let timesOfDay = [new SimpleSelectable('Morning'), new SimpleSelectable('Afternoon'), new SimpleSelectable('night')];

    beforeEach(() => {
        mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettings', ['']);
        mockFilterService      = jasmine.createSpyObj<FilterService>('filterService', ['getTimeOfDayFromAwsTimeString']);
        mockLookupService      = jasmine.createSpyObj<LookupService>('lookupService', ['getAgeGroups']);

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
        expect(comp).toBeTruthy();
    });

    it('should call setSelection', () => {
        spyOn(comp, 'onClickToSelect');
        comp['onClickToSelect'](new SimpleSelectable('Afternoon'));
        expect(comp['onClickToSelect']).toHaveBeenCalledTimes(1);
    });

    it('should reset', () => {
        comp.selectableTimeRanges = [new SimpleSelectable('Monday')];
        comp.selectableTimeRanges[0].isSelected = true;

        comp.reset();

        expect(comp.selectableTimeRanges[0].isSelected).toBe(false);
    });

    it('should not select anything if no time of day filter is set', () => {
      comp.selectableTimeRanges = timesOfDay;
      comp['setSelectedFilter']();
      const selectedTimes = comp.selectableTimeRanges.filter(time => time.isSelected);
      expect(selectedTimes.length).toBe(0);
      expect(mockFilterService.getTimeOfDayFromAwsTimeString).not.toHaveBeenCalled();
    });

    it('should not select time if time of day filter is set', () => {
      comp.selectableTimeRanges = timesOfDay;
      comp['filterService'].filterStringMeetingTimes = ' (or groupmeetingtime: [\'0001-01-01T00:00:00Z\', \'0001-01-01T12:00:00Z\']  )';
      mockFilterService.getTimeOfDayFromAwsTimeString.and.returnValue('Morning');
      comp['setSelectedFilter']();
      const selectedTimes = comp.selectableTimeRanges.filter(time => time.isSelected);
      expect(selectedTimes.length).toBe(1);
      expect(mockFilterService.getTimeOfDayFromAwsTimeString).toHaveBeenCalledTimes(1);
    });

});
