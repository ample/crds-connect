import { ViewType } from '../../../shared/constants';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { OnlineOrPhysicalGroupComponent } from './online-or-physical-group.component';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../filter.service';
import { StateService } from '../../../services/state.service';

import { MockTestData } from '../../../shared/MockTestData';

describe('OnlineOrPhysicalGroupComponent', () => {
    let fixture: ComponentFixture<OnlineOrPhysicalGroupComponent>;
    let comp: OnlineOrPhysicalGroupComponent;
    let el;
    let mockAppSettingsService, mockFilterService, mockStateService;
    let categories;

    beforeEach(() => {
        mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettings', ['']);
        mockFilterService      = jasmine.createSpyObj<FilterService>('filterService', ['setFilterStringIsVirtualGroup']);
        mockStateService       = jasmine.createSpyObj<StateService>('stateService', ['setCurrentView']);
        categories = MockTestData.getSomeCategories();

        TestBed.configureTestingModule({
            declarations: [
                OnlineOrPhysicalGroupComponent
            ],
            providers: [
                { provide: AppSettingsService, useValue: mockAppSettingsService },
                { provide: FilterService, useValue: mockFilterService },
                { provide: StateService, useValue: mockStateService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(OnlineOrPhysicalGroupComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should select virtual group', () => {
        spyOn(comp, 'setFilterString');
        comp.isVirtualGroupOptionClicked(true);
        expect(comp['isAnOptionSelected']).toBe(true);
        expect(comp['isVirtualGroup']).toBe(true);
        expect(comp['setFilterString']).toHaveBeenCalledTimes(1);
    });

    it('should reset', () => {
        comp.reset();
        expect(comp['isAnOptionSelected']).toBe(false);
        expect(comp['isVirtualGroup']).toBe(null);
    });

    it('should set and clear isVirtualGroup', () => {
      comp['isVirtualGroup'] = false;

      comp.setIsVirtualGroup(true);
      expect(comp.getIsVirtualGroup()).toEqual(true);

      comp.setIsVirtualGroup(false);
      expect(comp.getIsVirtualGroup()).toEqual(false);
    });

    it('should init', () => {
      spyOn(comp, 'setSelectedFilter');
      comp.ngOnInit();
      expect(comp.setSelectedFilter).toHaveBeenCalledTimes(1);
    });

    it('setSelectedFilter should not set anything if there is no kids welcome filter set', () => {
      comp.setSelectedFilter();
      expect(comp.isAnOptionSelected).toBe(false);
    });

    it('setSelectedFilter should set areKidsWelcome to true if filter is set to 1', () => {
      comp['filterService'].filterStringGroupLocation = ' (or groupvirtual: 1) ';
      comp.setSelectedFilter();
      expect(comp.isAnOptionSelected).toBe(true);
      expect(comp['isVirtualGroup']).toBe(true);
      expect(mockFilterService.setFilterStringIsVirtualGroup).toHaveBeenCalledWith(1, true);
      expect(mockStateService.setCurrentView).toHaveBeenCalledWith(ViewType.LIST);
    });

    it('setSelectedFilter should set areKidsWelcome to false if filter is set to 0', () => {
      comp['filterService'].filterStringGroupLocation = ' (or groupvirtual: 0) ';
      comp.setSelectedFilter();
      expect(comp.isAnOptionSelected).toBe(true);
      expect(comp['isVirtualGroup']).toBe(false);
      expect(mockFilterService.setFilterStringIsVirtualGroup).toHaveBeenCalledWith(0, true);
      expect(mockStateService.setCurrentView).not.toHaveBeenCalled();
    });
});
