import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { LookupService } from '../../services/lookup.service';
import { MockTestData } from '../../shared/MockTestData';
import { CreateGroupService } from './create-group-data.service';

describe('CreateGroupService', () => {
    let service;
    let mockLookupService;

    beforeEach(() => {
        mockLookupService = jasmine.createSpyObj<LookupService>('lookupService', ['getCategories']);
        TestBed.configureTestingModule({
            providers: [
                CreateGroupService,
                { provide: LookupService, useValue: mockLookupService }
                // for additional providers, write as examples below
                // ServiceName,
                // { provider: ServiceName, useValue: fakeServiceName },
                // { provider: ServiceName, useClass: FakeServiceClass },
                // { provider: ServiceName, useFactory: fakeServiceFactory, deps: [] },
            ]
        });
    });

    // you can also wrap inject() with async() for asynchronous tasks
    // it('...', async(inject([...], (...) => {}));

    it('should create the create group service',
        inject([CreateGroupService], (s: CreateGroupService) => {
            expect(s).toBeTruthy();
            // expect('1').toEqual(1);
        })
    );


    it('should initialize page one from uninitialized state',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            (mockLookupService.getCategories).and.returnValue(Observable.of(categories));

            s.initializePageOne().subscribe(result => {
                expect(result).toBe(categories);
                expect(s.categories).toBe(categories);
                expect(mockLookupService.getCategories).toHaveBeenCalledTimes(1);
            });
        })
    );

    it('should initialize page one from initialized state',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            s.categories = categories;
            s['pageOneInitialized'] = true;

            s.initializePageOne().subscribe(result => {
                expect(result).toBe(categories);
                expect(s.categories).toBe(categories);
                expect(mockLookupService.getCategories).not.toHaveBeenCalled();
            });
        })
    );
});
