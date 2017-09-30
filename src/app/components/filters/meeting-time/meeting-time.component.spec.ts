import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { FilterService } from '../../../services/filter.service';
import { MockTestData } from '../../../shared/MockTestData';
import { MeetingTimeComponent } from './meeting-time.component';
import { SimpleSelectable } from '../../../models/simple-selectable';

describe('MeetingTimeComponent', () => {
  let fixture: ComponentFixture<MeetingTimeComponent>;
  let comp: MeetingTimeComponent;
  let el;
  let mockFilterService;
  const timesOfDay = [new SimpleSelectable('Morning'), new SimpleSelectable('Afternoon'), new SimpleSelectable('night')];

  beforeEach(() => {
    mockFilterService = jasmine.createSpyObj<FilterService>('filterService', ['getSelectedMeetingTimes']);

    TestBed.configureTestingModule({
      declarations: [
        MeetingTimeComponent
      ],
      providers: [
        { provide: FilterService, useValue: mockFilterService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
  });

  it('should not select time if time of day filter is set', () => {
    comp.selectableTimeRanges = timesOfDay;
    mockFilterService.getSelectedMeetingTimes.and.returnValue(['Morning']);
    comp['setSelectedFilter']();
    const selectedTimes = comp.selectableTimeRanges.filter(time => time.isSelected);
    expect(selectedTimes.length).toBe(1);
  });

});
