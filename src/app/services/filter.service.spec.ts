import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { FilterService } from '../services/filter.service';

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

});
