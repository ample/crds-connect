import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { FilterService } from '../services/filter.service';

import { SimpleSelectable} from '../models/simple-selectable';

import { daysOfWeek, groupMeetingTimeRanges, awsMeetingTimeSearchStrings} from '../shared/constants';

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

      let expectedAwsTimeRangeSearchString: string = ` (or groupmeetingtime: ['0001-01-01T00:00:00Z', '0001-01-01T12:00:00Z']  groupmeetingtime: ['0001-01-01T17:00:00Z', '0001-01-01T00:00:00Z']  )`;
      service.setFilterStringMeetingTimes(selectedTimeRanges);
      let actualAwsMeetingTimeRangesSearchString: string = service.filterStringMeetingTimes;

      expect(actualAwsMeetingTimeRangesSearchString).toEqual(expectedAwsTimeRangeSearchString);

    }));


});
