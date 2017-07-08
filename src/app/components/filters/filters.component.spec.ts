import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AppSettingsService } from '../../services/app-settings.service';
import { FilterService } from '../../services/filter.service';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';
import { MockTestData } from '../../shared/MockTestData';
import { FiltersComponent } from './filters.component';
import { KidsWelcomeComponent } from './kids-welcome/kids-welcome.component';
import { AgeGroupsComponent } from './age-groups/age-groups.component';

describe('FiltersComponent', () => {
    let fixture: ComponentFixture<FiltersComponent>;
    let comp: FiltersComponent;
    let mockAppSettingsService, mockFilterService, mockPinService, mockStateService, mockRouter;

    beforeEach(() => {
        mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettings', ['isConnectApp']);
        mockFilterService = jasmine.createSpyObj<FilterService>('filterService', ['buildFilters']);
        mockPinService = jasmine.createSpyObj<PinService>('pinService', ['emitPinSearchRequest']);
        mockStateService = jasmine.createSpyObj<StateService>('stateService',
          ['emitPinSearchRequest', 'setMyViewOrWorldView', 'setIsFilterDialogOpen']);
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [
                FiltersComponent
            ],
            providers: [
                { provide: AppSettingsService, useValue: mockAppSettingsService },
                { provide: FilterService, useValue: mockFilterService },
                { provide: PinService, useValue: mockPinService },
                { provide: StateService, useValue: mockStateService },
                { provide: Router, useValue: mockRouter }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(FiltersComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should apply filters', () => {
        comp.onSubmit();
        expect(mockStateService.setMyViewOrWorldView).toHaveBeenCalled();
        expect(mockStateService.setIsFilterDialogOpen).toHaveBeenCalled();
        expect(mockFilterService.buildFilters).toHaveBeenCalled();
    });

    it('should reset filters', () => {
        comp.childKidsWelcomeComponent = jasmine.createSpyObj<KidsWelcomeComponent>('kidsWelcome', ['reset']);
        comp.childAgeGroupsComponent = jasmine.createSpyObj<AgeGroupsComponent>('ageGroups', ['reset']);
        comp.resetFilters();
        expect(comp.childKidsWelcomeComponent.reset).toHaveBeenCalled();
        expect(comp.childAgeGroupsComponent.reset).toHaveBeenCalled();
    });
});
