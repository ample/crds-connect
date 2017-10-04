import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { FilterService } from '../../../services/filter.service';
import { LookupService } from '../../../services/lookup.service';
import { MockTestData } from '../../../shared/MockTestData';
import { CategoryComponent } from './category.component';
import { Category } from '../../../models';

describe('CategoryComponent', () => {
    let fixture: ComponentFixture<CategoryComponent>;
    let comp: CategoryComponent;
    let mockFilterService, mockLookupService;
    let categories: Category[];

    beforeEach(() => {
        mockFilterService      = jasmine.createSpyObj<FilterService>('fs', ['setFilterStringCategories', 'getSelectedCategories']);
        mockLookupService      = jasmine.createSpyObj<LookupService>('lookupService', ['getCategories']);
        categories = MockTestData.getSomeCategories();

        TestBed.configureTestingModule({
            declarations: [
                CategoryComponent
            ],
            providers: [
                { provide: FilterService, useValue: mockFilterService },
                { provide: LookupService, useValue: mockLookupService}
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CategoryComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        spyOn(comp, 'initializeCategories');
        expect(comp).toBeTruthy();
    });

    it('should init', () => {
        spyOn(comp, 'initializeCategories');
        comp.ngOnInit();
        expect(comp['initializeCategories']).toHaveBeenCalledTimes(1);
    });

    it('should call setSelection', () => {
        spyOn(comp, 'setSelection');
        spyOn(comp, 'setFilterString');
        comp.clickToSelect('123');
        expect(comp['setSelection']).toHaveBeenCalledTimes(1);
        expect(comp['setFilterString']).toHaveBeenCalledTimes(1);
    });

    it('should reset', () => {
        let cat1 = new Category(1, null, 'Interest desc', 'example text', false, 'Interest');
        cat1.selected = true;
        let cat2 = new Category(2, null, 'Healing desc', 'example text', false, 'Healing');
        cat2.selected = true;

        comp['categories'] = [cat1, cat2];
        comp.reset();

        expect(comp['categories'][0].selected).toBe(false);
        expect(comp['categories'][1].selected).toBe(false);
    });

    it('should initialize categories', () => {
      spyOn(comp, 'setSelectedCategories');
      mockLookupService.getCategories.and.returnValue(Observable.of(categories));
      comp['initializeCategories']();
      expect(comp['categories'].length).toBe(5);
    });

    it('should not select anything if filterService has no category filters', () => {
      mockLookupService.getCategories.and.returnValue(Observable.of(categories));
      comp.ngOnInit();
      const selectedCats = comp['categories'].filter(i => i.selected);
      expect(selectedCats.length).toBe(0);
    });

    it('should set selected categories if filterService has filter string', () => {
      const ages = MockTestData.getAgeRangeAttributeTypeWithAttributes();
      mockLookupService.getCategories.and.returnValue(Observable.of(categories));
      mockFilterService.getSelectedCategories.and.returnValue([categories[0].name, categories[1].name]);
      comp['initializeCategories']();
      const selectedCats = comp['categories'].filter(i => i.selected);
      expect(selectedCats.length).toBe(2);
    });
});
