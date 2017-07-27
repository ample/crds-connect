import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { FilterService } from '../services/filter.service';

import { SimpleSelectable} from '../models/simple-selectable';

import { daysOfWeek} from '../shared/constants';

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
      let actualDaysOfTheWeek: string[] = service.getDayNamesArrayFromClass(daysOfWeek);
      expect(actualDaysOfTheWeek).toEqual(expectedDaysOfTheWeek);
    }));

    it('should return an array of selectable values', inject([FilterService], (service: any) => {
      let dayOfWeekNames: string[] = service.getDayNamesArrayFromClass(daysOfWeek);

      let expectedFirstSelectableElement: SimpleSelectable = new SimpleSelectable('Monday');
      let actualFirstSelectableElement: SimpleSelectable = service.buildSelectableObjectsFromStringArray(dayOfWeekNames)[0];

      expect(actualFirstSelectableElement).toEqual(expectedFirstSelectableElement);

    }));

    it('should return an array of selectable days of the week', inject([FilterService], (service: any) => {

        let selectableDaysOfTheWeek: SimpleSelectable[] = service.getSelectableDaysOfTheWeek(daysOfWeek);
        let expectedFirstSelectableElement: SimpleSelectable = new SimpleSelectable('Monday');
        let actualFirstSelectableElement = selectableDaysOfTheWeek[0];

        expect(actualFirstSelectableElement).toEqual(expectedFirstSelectableElement);

    }));

    //TODO: Check if leading spaces are necessary
    it('should return a valid search string when searching for one day', inject([FilterService], (service: any) => {

        let selectedDays: SimpleSelectable[] = [new SimpleSelectable('Monday')];
        selectedDays[0].isSelected = true;

        let expectedAwsDaySearchString: string = " (or groupmeetingday: 'Monday'  )";
        service.setFilterStringMeetingDays(selectedDays);
        let actualAwsDaySearchString: string = service.filterStringMeetingDays;

        expect(actualAwsDaySearchString).toEqual(expectedAwsDaySearchString);

    }));


});
