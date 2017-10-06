import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { FilterService } from './filter.service';

import { SimpleSelectable, pinType} from '../models';

import { daysOfWeek, groupMeetingTimeRanges, awsMeetingTimeSearchStrings, meetingFrequencyNames} from '../shared/constants';

describe('Service: Filters ', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [FilterService]
        });
    });

    it('should build filters', inject([FilterService], (service: any) => {
        service.filterStringKidsWelcome = ' kids ';
        service.filterStringAgeGroups = ' ages ';
        let filterString: string = service.buildFilters();
        expect(filterString).toEqual(' kids  ages ');
    }));

    it('should reset filters', inject([FilterService], (service: any) => {
        service.filterStringKidsWelcome = ' kids ';
        service.filterStringAgeGroups = ' ages ';
        service.resetFilterString();
        expect(service.filterStringKidsWelcome).toEqual(null);
        expect(service.filterStringAgeGroups).toEqual(null);
    }));

    it('should return an array of days of the week', inject([FilterService], (service: any) => {
      let expectedDaysOfTheWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      let actualDaysOfTheWeek: string[] = service.buildAnArrayOfPropertyValuesFromObject(daysOfWeek);
      expect(actualDaysOfTheWeek).toEqual(expectedDaysOfTheWeek);
    }));

    it('should return an array of selectable values', inject([FilterService], (service: any) => {
      let dayOfWeekNames: string[] = service.buildAnArrayOfPropertyValuesFromObject(daysOfWeek);

      let expectedFirstSelectableElement: SimpleSelectable = new SimpleSelectable('Monday');
      let actualFirstSelectableElement: SimpleSelectable = service.buildSelectableObjectsFromStringArray(dayOfWeekNames)[0];

      expect(actualFirstSelectableElement).toEqual(expectedFirstSelectableElement);

    }));

    it('should return an array of selectable days of the week', inject([FilterService], (service: any) => {

      let selectableDaysOfTheWeek: SimpleSelectable[] = service.buildArrayOfSelectables(daysOfWeek);
      let expectedFirstSelectableElement: SimpleSelectable = new SimpleSelectable('Monday');
      let actualFirstSelectableElement = selectableDaysOfTheWeek[0];

      expect(actualFirstSelectableElement).toEqual(expectedFirstSelectableElement);

    }));

    it('should return a valid search string when searching for one day', inject([FilterService], (service: any) => {

      let selectedDays: SimpleSelectable[] = [new SimpleSelectable('Monday')];
      selectedDays[0].isSelected = true;

      let expectedAwsDaySearchString: string = " (or groupmeetingday: 'Monday'  )";
      service.setFilterStringMeetingDays(selectedDays);
      let actualAwsDaySearchString: string = service.filterStringMeetingDays;

      expect(actualAwsDaySearchString).toEqual(expectedAwsDaySearchString);

    }));

   it('should return a valid search string when searching for an afternoon group',
     inject([FilterService], (service: any) => {

     let selectedTimeRanges: SimpleSelectable[] = [new SimpleSelectable(groupMeetingTimeRanges.AFTERNOONS)];
     selectedTimeRanges[0].isSelected = true;

     let expectedAwsTimeRangeSearchString: string = ` (or groupmeetingtime: ${awsMeetingTimeSearchStrings.AFTERNOONS}  )`;
     service.setFilterStringMeetingTimes(selectedTimeRanges);
     let actualAwsMeetingTimeRangesSearchString: string = service.filterStringMeetingTimes;

     expect(actualAwsMeetingTimeRangesSearchString).toEqual(expectedAwsTimeRangeSearchString);

    }));

    it('should return a valid search string when searching for a morning or evening group',
      inject([FilterService], (service: any) => {

      let selectedTimeRanges: SimpleSelectable[] = [new SimpleSelectable(groupMeetingTimeRanges.MORNINGS),
                                                  new SimpleSelectable(groupMeetingTimeRanges.EVENINGS)];
      selectedTimeRanges[0].isSelected = true;
      selectedTimeRanges[1].isSelected = true;

      let expectedAwsTimeRangeSearchString: string = ` (or groupmeetingtime: ['0001-01-01T00:00:00Z', '0001-01-01T12:00:00Z']  groupmeetingtime: ['0001-01-01T17:00:00Z', '0001-01-01T23:59:00Z']  )`;
      service.setFilterStringMeetingTimes(selectedTimeRanges);
      let actualAwsMeetingTimeRangesSearchString: string = service.filterStringMeetingTimes;

      expect(actualAwsMeetingTimeRangesSearchString).toEqual(expectedAwsTimeRangeSearchString);

    }));

    it('should not return and empty filter after change',
      inject([FilterService], (service: any) => {

      let selectedTimeRanges: SimpleSelectable[] = [new SimpleSelectable(groupMeetingTimeRanges.MORNINGS),
                                                  new SimpleSelectable(groupMeetingTimeRanges.EVENINGS)];
      selectedTimeRanges[0].isSelected = true;
      selectedTimeRanges[1].isSelected = true;

      let selectedFreq: SimpleSelectable[] = [new SimpleSelectable(meetingFrequencyNames.BI_WEEKLY)];
      selectedFreq[0].isSelected = true;

      let expectedstring1: string = ` (or groupmeetingtime: ['0001-01-01T00:00:00Z', '0001-01-01T12:00:00Z']  groupmeetingtime: ['0001-01-01T17:00:00Z', '0001-01-01T23:59:00Z']  ) (or groupmeetingfrequency: 'Every Other Week'  )`;
      service.setFilterStringMeetingTimes(selectedTimeRanges);
      let actualAwsMeetingTimeRangesSearchString: string = service.filterStringMeetingTimes;

      service.setFilterStringMeetingFrequencies(selectedFreq);
      let rc = service.buildFilters();
      expect(rc).toEqual(expectedstring1);

      selectedFreq[0].isSelected = false;
      service.setFilterStringMeetingFrequencies(selectedFreq);
      rc = service.buildFilters();
      let expectedstring2: string = ` (or groupmeetingtime: ['0001-01-01T00:00:00Z', '0001-01-01T12:00:00Z']  groupmeetingtime: ['0001-01-01T17:00:00Z', '0001-01-01T23:59:00Z']  )`;
      expect(rc).toEqual(expectedstring2);
    }));

    it('should return morning time of day string from AWS time range',
    inject([FilterService], (service: any) => {
      const result = service.getTimeOfDayFromAwsTimeString('[\'0001-01-01T00:00:00Z\', \'0001-01-01T12:00:00Z\']');
      expect(result).toBe('Mornings (before noon)');
    }));

    it('should return afternoon time of day string from AWS time range',
    inject([FilterService], (service: any) => {
      const result = service.getTimeOfDayFromAwsTimeString('[\'0001-01-01T12:00:00Z\', \'0001-01-01T17:00:00Z\']');
      expect(result).toBe('Afternoons (12-5pm)');
    }));

    it('should return Evening time of day string from AWS time range',
    inject([FilterService], (service: any) => {
      const result = service.getTimeOfDayFromAwsTimeString('[\'0001-01-01T17:00:00Z\', \'0001-01-01T23:59:00Z\']');
      expect(result).toBe('Evenings (after 5pm)');
    }));

    it('should display an error if awsMeetingTimeString conversion does not work',
    inject([FilterService], (service: any) => {
      spyOn(console, 'log');
      const result = service.getTimeOfDayFromAwsTimeString('yabba dabba doo');
      expect(result).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Error: couldn\'t get awsMeetingTimeSearchString from yabba dabba doo');
    }));

    xit('should return a valid search string for a single meeting frequency',
      inject([FilterService], (service: any) => {

        let selectedFrequencies: SimpleSelectable[] = [new SimpleSelectable(meetingFrequencyNames.BI_WEEKLY)];
        selectedFrequencies[0].isSelected = true;

        let expectedAwsFrequenciesSearchString: string = ` (or groupmeetingfrequency: 'Every other week' )`;
        service.setFilterStringMeetingFrequencies(selectedFrequencies);
        let actualAwsMeetingFrequenciesSearchString: string = service.filterStringMeetingFrequencies;

        expect(actualAwsMeetingFrequenciesSearchString).toEqual(expectedAwsFrequenciesSearchString);

    }));

    it('should setFilterStringHostOnly string if true is passed in', inject([FilterService], (service: any) => {
      service.setFilterStringHostOnly(true);
      expect(service.filterStringHostOnly).toBe(` (or pintype: ${pinType.GATHERING} pintype: ${pinType.SITE})`);
    }));

    it('should null setFilterStringHostOnly string if false is passed in', inject([FilterService], (service: any) => {
      service.filterStringHostOnly = 'asdf';
      service.setFilterStringHostOnly(false);
      expect(service.filterStringHostOnly).toBe(null);
    }));

    it('getIsHostOnlyFiltered should return true if there is a filter string', inject([FilterService], (service: any) => {
      service.filterStringHostOnly = 'asdf';
      expect(service.getIsHostOnlyFiltered()).toBe(true);
    }));

    it('getIsHostOnlyFiltered should return false if there is no filter string', inject([FilterService], (service: any) => {
      expect(service.getIsHostOnlyFiltered()).toBe(false);
    }));


    describe('getSelectedAgeGroups',  () => {
      it('should return undefined if no age group filter', inject([FilterService], (service: any) => {
        expect(service.getSelectedAgeGroups()).toBeUndefined();
      }));

      it('should return array of selected filters based on filter string', inject([FilterService], (service: any) => {
        service.filterStringAgeGroups = ` (or groupagerange: 'Middle school' groupagerange: '20's'  )`;
        const result = service.getSelectedAgeGroups();
        expect(result.length).toBe(2);
        expect(result[0]).toBe('Middle school');
        expect(result[1]).toBe('20s');
      }));
    });

    describe('getSelectedCategories', () => {
      it('should return undefined if no category filter', inject([FilterService], (service: any) => {
        expect(service.getSelectedCategories()).toBeUndefined();
      }));

      it('should return array of selected categories', inject([FilterService], (service: FilterService) => {
        service.filterStringCategories = ` (or (prefix field='groupcategory' 'Category 2')  (prefix field='groupcategory' 'Category 1') )`;
        const result = service.getSelectedCategories();
        expect(result.length).toBe(2);
        expect(result[0]).toBe('Category 2');
        expect(result[1]).toBe('Category 1');
      }));
    });

    describe('getSelectedGenderMixes', () => {
      it('should return undefined if no gender mix filter', inject([FilterService], (service: FilterService) => {
        expect(service.getSelectedGenderMixes()).toBeUndefined();
      }));

      it('should return selected gender mix type (single select) string', inject([FilterService], (service: FilterService) => {
        service.filterStringGroupTypes = ` (or grouptype: 'just dudes '  )`;
        const result = service.getSelectedGenderMixes();
        expect(result).toBe('just dudes');
      }));
    });

    describe('getSelectedKidsWelcomeFlag', () => {
      it('should return undefined if no kids welcome filter set', inject([FilterService], (service: FilterService) => {
        expect(service.getSelectedKidsWelcomeFlag()).toBeUndefined();
      }));

      it('should return "1" if filter is set to true', inject([FilterService], (service: FilterService) => {
        service.filterStringKidsWelcome = ' (or groupkidswelcome: 1) ';
        expect(service.getSelectedKidsWelcomeFlag()).toBe('1');
      }));

      it('should return "0" is set to false', inject([FilterService], (service: FilterService) => {
        service.filterStringKidsWelcome = ' (or groupkidswelcome: 0) ';
        expect(service.getSelectedKidsWelcomeFlag()).toBe('0');
      }));
    });

    describe('getSelectedMeetingDays', () => {
      it('should return undefined if no meeting days filter set', inject([FilterService], (service: FilterService) => {
        expect(service.getSelectedMeetingDays()).toBeUndefined();
      }));

      it('should return selected meeting days as string array', inject([FilterService], (service: FilterService) => {
        service.filterStringMeetingDays = ' (or groupmeetingday: \'Monday\'  )';
        const result = service.getSelectedMeetingDays();
        expect(result.length).toBe(1);
        expect(result[0]).toBe('Monday');
      }));
    });

    describe('getSelectedMeetingFrequencies', () => {
      it('should return undefined if no meeting frequencies filter set', inject([FilterService], (service: FilterService) => {
        expect(service.getSelectedMeetingFrequencies()).toBeUndefined();
      }));

      it('should return selected meeting frequencies as string array', inject([FilterService], (service: FilterService) => {
        service.filterStringMeetingFrequencies = ' (or groupmeetingfrequency: \'Every Week\'  groupmeetingfrequency: \'Every Other Week \'  )';
        const result = service.getSelectedMeetingFrequencies();
        expect(result.length).toBe(2);
        expect(result[0]).toBe('Every Week');
        expect(result[1]).toBe('Every Other Week');
      }));
    });

    describe('getSelectedMeetingTimes', () => {
      it('should return undefined if no meeting time filter set', inject([FilterService], (service: FilterService) => {
        expect(service.getSelectedMeetingTimes()).toBeUndefined();
      }));

      it('should return selected meeting frequencies as string array', inject([FilterService], (service: FilterService) => {
        service.filterStringMeetingTimes = ' (or groupmeetingtime: [\'0001-01-01T00:00:00Z\', \'0001-01-01T12:00:00Z\']  )';
        const result = service.getSelectedMeetingTimes();
        expect(result.length).toBe(1);
        expect(result[0]).toBe('Mornings (before noon)');
      }));
    });

    describe('getSelectedGroupLocation', () => {
      it('should return undefined if no location set', inject([FilterService], (service: FilterService) => {
        expect(service.getSelectedGroupLocation()).toBeUndefined();
      }));

      it('should return "1" if filter is set to true', inject([FilterService], (service: FilterService) => {
        service.filterStringGroupLocation = ' (or groupvirtual: 1) ';
        expect(service.getSelectedGroupLocation()).toBe('1');
      }));

      it('should return "0" is set to false', inject([FilterService], (service: FilterService) => {
        service.filterStringGroupLocation = ' (or groupvirtual: 0) ';
        expect(service.getSelectedGroupLocation()).toBe('0');
      }));
    });
});
