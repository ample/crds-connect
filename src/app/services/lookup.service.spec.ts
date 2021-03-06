import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { LookupService } from './lookup.service';
import { SessionService } from './session.service';
import { Attribute } from '../models/attribute';

import { attributeTypes } from '../shared/constants';

describe('LookupService', () => {
    let service;
    let mockSessionService;
    let daysOfTheWeek = [
        { dp_RecordID: 6, dp_RecordName: 'Sunday' },
        { dp_RecordID: 3, dp_RecordName: 'Monday' },
        { dp_RecordID: 1, dp_RecordName: 'Nope' }
    ];

    beforeEach(() => {
        mockSessionService = jasmine.createSpyObj<SessionService>('session', ['get']);
        TestBed.configureTestingModule({
            providers: [
                LookupService,
                { provide: SessionService, useValue: mockSessionService }
            ]
        });
    });

    // you can also wrap inject() with async() for asynchronous tasks
    // it('...', async(inject([...], (...) => {}));

    it('should enter the assertion',
        inject([LookupService], (s: LookupService) => {
            expect(s).toBeTruthy();
            // expect('1').toEqual(1);
        })
    );

    it('should getCategories',
        inject([LookupService], (s: LookupService) => {
            (mockSessionService.get).and.returnValue(Observable.of({}));
            s.getCategories().subscribe(categories => {
                expect(mockSessionService.get).toHaveBeenCalledWith(`${s['baseUrl']}api/v1.0.0/group-tool/categories`);
            });
        })
    );

    it('should getAgeRanges',
        inject([LookupService], (s: LookupService) => {
            (mockSessionService.get).and.returnValue(Observable.of({}));
            s.getAgeRanges().subscribe(categories => {
                expect(mockSessionService.get).toHaveBeenCalledWith(`${s['baseUrl']}api/v1.0.0/attribute-type/${attributeTypes.AgeRangeAttributeTypeId}`);
            });
        })
    );

    it('should getGroupGenderMixTypes',
        inject([LookupService], (s: LookupService) => {
            (mockSessionService.get).and.returnValue(Observable.of({}));
            s.getGroupGenderMixTypes().subscribe(categories => {
                expect(mockSessionService.get).toHaveBeenCalledWith(`${s['baseUrl']}api/v1.0.0/attribute-type/${attributeTypes.GroupGenderMixTypeAttributeId}`);
            });
        })
    );

    it('should getDaysOfTheWeek and order them',
        inject([LookupService], (s: LookupService) => {
            (mockSessionService.get).and.returnValue(Observable.of(daysOfTheWeek));
            s.getDaysOfTheWeek().subscribe(days => {
                expect(mockSessionService.get).toHaveBeenCalledWith(`${s['baseUrl']}api/v1.0.0/lookup/meetingdays`);
                expect(days[0].dp_RecordID).toBe(1);
                expect(days[2].dp_RecordID).toBe(6);
            });
        })
    );

});
