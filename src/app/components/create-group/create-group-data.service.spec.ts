import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { LookupService } from '../../services/lookup.service';
import { groupCategoryAttributeTypeId } from '../../shared/constants';
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

    it('should validate selected groups and return valid as true and set selectedCategories',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            s.categories = categories;
            s['pageOneInitialized'] = true;
            s.categories[0].selected = true;
            s.categories[1].selected = true;
            let value = s.validateCategories();
            expect(value).toBe(true);
            expect(s['selectedCategories'].length).toBe(2);
        })
    );

    it('should validate selected groups and return valid as false',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            s.categories = categories;
            s['pageOneInitialized'] = true;
            s.categories[0].selected = true;
            s.categories[1].selected = true;
            s.categories[2].selected = true;
            let value = s.validateCategories();
            expect(value).toBe(false);
            expect(s['selectedCategories'].length).toBe(3);
        })
    );

    it('should add attributes to group model',
        inject([CreateGroupService], (s: CreateGroupService) => {
            let categories = MockTestData.getSomeCategories();
            s.categories = categories;
            s['pageOneInitialized'] = true;
            s.categories[0].selected = true;
            s.categories[1].selected = true;
            s.validateCategories();
            s.addSelectedCategoriesToGroupModel();
            expect(s.group.attributeTypes[groupCategoryAttributeTypeId].attributeTypeId).toBe(groupCategoryAttributeTypeId);
            expect(s.group.attributeTypes[groupCategoryAttributeTypeId].name).toBe('Group Category');
            expect(s.group.attributeTypes[groupCategoryAttributeTypeId].attributes.length).toBe(2);
        })
    );
});
