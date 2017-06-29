import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { LookupService } from './lookup.service';
import { SessionService } from './session.service';

describe('LookupService', () => {
    let service;
    let mockSessionService;

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
});
