import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { FilterService } from '../filter.service';
import { MockTestData } from '../../../shared/MockTestData';
import { MeetingDayComponent } from './meeting-day.component';
import { SimpleSelectable } from '../../../models/simple-selectable';

import { daysOfWeek } from '../../../shared/constants';

describe('MeetingDayComponent', () => {
  let fixture: ComponentFixture<MeetingDayComponent>;
  let comp: MeetingDayComponent;
  let el;
  let mockFilterService;
  let daysOfTheWeek: SimpleSelectable[] = [new SimpleSelectable('Monday'), new SimpleSelectable('Tuesday'), new SimpleSelectable('Wednesday')];

  beforeEach(() => {
    mockFilterService = jasmine.createSpyObj<FilterService>('fs', ['setFilterStringMeetingDays', 'buildArrayOfSelectables', 'getSelectedMeetingDays']);

    TestBed.configureTestingModule({
      declarations: [
        MeetingDayComponent
      ],
      providers: [
        { provide: FilterService, useValue: mockFilterService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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

  it('setSelectedFilter should set filtered days to selected', () => {
    comp.selectableDaysOfWeek = daysOfTheWeek;
    mockFilterService.getSelectedMeetingDays.and.returnValue(['Monday']);
    comp['setSelectedFilter']();
    const selectedDaysOfTheWeek = comp.selectableDaysOfWeek.filter(stuff => stuff.isSelected);
    expect(selectedDaysOfTheWeek.length).toBe(1);
  });

});
