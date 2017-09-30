import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { FilterService } from '../filter.service';
import { MockTestData } from '../../../shared/MockTestData';
import { MeetingFrequencyComponent } from './meeting-frequency.component';

import { Attribute, SimpleSelectable } from '../../../models';

describe('MeetingFrequencyComponent', () => {
  let fixture: ComponentFixture<MeetingFrequencyComponent>;
  let comp: MeetingFrequencyComponent;
  let el;
  let mockFilterService;
  let meetingFrequencies = [new SimpleSelectable('Every Week'), new SimpleSelectable('Every Other Week'), new SimpleSelectable('Every Month')];

  beforeEach(() => {
    mockFilterService = jasmine.createSpyObj<FilterService>('fs', ['buildArrayOfSelectables', 'getSelectedMeetingFrequencies']);

    TestBed.configureTestingModule({
      declarations: [
        MeetingFrequencyComponent
      ],
      providers: [
        { provide: FilterService, useValue: mockFilterService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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

    expect(comp.selectableMeetingFrequencies[0].isSelected).toBe(false);
  });

  it('should init', () => {
    mockFilterService.buildArrayOfSelectables.and.returnValue(meetingFrequencies);
    spyOn(comp, 'setSelectedFilter');
    comp.ngOnInit();
    expect(comp['setSelectedFilter']).toHaveBeenCalled();
    expect(comp.selectableMeetingFrequencies.length).toBe(3);
  });

  it('setSelectedFilter should not select anything if there is no frequency filter string', () => {
    comp.selectableMeetingFrequencies = meetingFrequencies;
    comp['setSelectedFilter']();
    const selectedFrequencies = comp.selectableMeetingFrequencies.filter(stuff => stuff.isSelected);
    expect(selectedFrequencies.length).toBe(0);
  });

  it('setSelectedFilter should set filtered frequencies to selected', () => {
    comp.selectableMeetingFrequencies = meetingFrequencies;
    mockFilterService.getSelectedMeetingFrequencies.and.returnValue(['Every Week', 'Every Other Week']);
    comp['setSelectedFilter']();
    const selectedFrequencies = comp.selectableMeetingFrequencies.filter(stuff => stuff.isSelected);
    expect(selectedFrequencies.length).toBe(2);
  });

});
