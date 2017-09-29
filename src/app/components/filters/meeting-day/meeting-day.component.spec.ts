import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../filter.service';
import { LookupService } from '../../../services/lookup.service';
import { MockTestData } from '../../../shared/MockTestData';
import { MeetingDayComponent} from './meeting-day.component';
import { SimpleSelectable } from '../../../models/simple-selectable';
import { AgeGroup } from '../../../models/age-group';
import { Attribute } from '../../../models/attribute';

import { daysOfWeek } from '../../../shared/constants';

describe('MeetingDayComponent', () => {
    let fixture: ComponentFixture<MeetingDayComponent>;
    let comp: MeetingDayComponent;
    let el;
    let mockAppSettingsService, mockFilterService, mockLookupService;
    let daysOfTheWeek: SimpleSelectable[] = [new SimpleSelectable('Monday'), new SimpleSelectable('Tuesday'), new SimpleSelectable('Wednesday')];

    beforeEach(() => {
        mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettings', ['']);
        mockFilterService = jasmine.createSpyObj<FilterService>('filterService', ['setFilterStringMeetingDays', 'buildArrayOfSelectables']);
        mockLookupService = jasmine.createSpyObj<LookupService>('lookupService', ['getAgeGroups']);

        TestBed.configureTestingModule({
            declarations: [
                MeetingDayComponent
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
            fixture = TestBed.createComponent(MeetingDayComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should call onClickToSelect', () => {
        spyOn(comp, 'onClickToSelect');
        comp['onClickToSelect'](new SimpleSelectable('Monday'));
        expect(comp['onClickToSelect']).toHaveBeenCalledTimes(1);
    });

    it('should reset', () => {
        comp.selectableDaysOfWeek = [new SimpleSelectable('Monday')];
        comp.selectableDaysOfWeek[0].isSelected = true;

        comp.reset();

        expect(comp.selectableDaysOfWeek[0].isSelected).toBe(false);
    });

    it('should init', () => {
      mockFilterService.buildArrayOfSelectables.and.returnValue(daysOfTheWeek);
      spyOn(comp, 'setSelectedFilter');
      comp.ngOnInit();
      expect(comp.selectableDaysOfWeek.length).toBe(3);
      expect(comp['setSelectedFilter']).toHaveBeenCalledTimes(1);
    });

    it('setSelectedFilter should not select anything if there is no day of week filter string', () => {
      comp.selectableDaysOfWeek = daysOfTheWeek;
      comp['setSelectedFilter']();
      const selectedDaysOfTheWeek = comp.selectableDaysOfWeek.filter(stuff => stuff.isSelected);
      expect(selectedDaysOfTheWeek.length).toBe(0);
    });

    it('setSelctedFilter should set filtered days to selected', () => {
      comp.selectableDaysOfWeek = daysOfTheWeek;
      comp['filterService'].filterStringMeetingDays = ' (or groupmeetingday: \'Monday\'  )';
      comp['setSelectedFilter']();
      const selectedDaysOfTheWeek = comp.selectableDaysOfWeek.filter(stuff => stuff.isSelected);
      expect(selectedDaysOfTheWeek.length).toBe(1);
    });

});
