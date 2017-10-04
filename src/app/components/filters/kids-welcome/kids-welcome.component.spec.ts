import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { FilterService } from '../../../services/filter.service';
import { MockTestData } from '../../../shared/MockTestData';
import { KidsWelcomeComponent } from './kids-welcome.component';

describe('KidsWelcomeComponent', () => {
    let fixture: ComponentFixture<KidsWelcomeComponent>;
    let comp: KidsWelcomeComponent;
    let el;
    let mockFilterService;

    beforeEach(() => {
        mockFilterService = jasmine.createSpyObj<FilterService>('fs ', ['setFilterStringKidsWelcome', 'getSelectedKidsWelcomeFlag']);

        TestBed.configureTestingModule({
            declarations: [
                KidsWelcomeComponent
            ],
            providers: [
                { provide: FilterService, useValue: mockFilterService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(KidsWelcomeComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should welcome kids', () => {
        spyOn(comp, 'setFilterString');
        comp.kidsWelcome(true);
        expect(comp['selected']).toBe(true);
        expect(comp['areKidsWelcome']).toBe(true);
        expect(comp['setFilterString']).toHaveBeenCalledTimes(1);
    });

    it('should reset', () => {
        comp.reset();
        expect(comp['selected']).toBe(false);
        expect(comp['areKidsWelcome']).toBe(null);
    });

    it('should init', () => {
      spyOn(comp, 'setSelectedFilter');
      comp.ngOnInit();
      expect(comp.setSelectedFilter).toHaveBeenCalledTimes(1);
    });

    it('setSelectedFilter should not set anything if there is no kids welcome filter set', () => {
      comp.setSelectedFilter();
      expect(comp.selected).toBe(false);
    });

    it('setSelectedFilter should set areKidsWelcome to true if filter is set to 1', () => {
      mockFilterService.getSelectedKidsWelcomeFlag.and.returnValue('1');
      comp.setSelectedFilter();
      expect(comp.selected).toBe(true);
      expect(comp.areKidsWelcome).toBe(true);
      expect(mockFilterService.setFilterStringKidsWelcome).toHaveBeenCalledWith(1, true);
    });

    it('setSelectedFilter should set areKidsWelcome to false if filter is set to 0', () => {
      mockFilterService.getSelectedKidsWelcomeFlag.and.returnValue('0');
      comp.setSelectedFilter();
      expect(comp.selected).toBe(true);
      expect(comp.areKidsWelcome).toBe(false);
      expect(mockFilterService.setFilterStringKidsWelcome).toHaveBeenCalledWith(0, true);
    });
});
