import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AppSettingsService } from '../../../services/app-settings.service';
import { FilterService } from '../../../services/filter.service';
import { MockTestData } from '../../../shared/MockTestData';
import { OnlineOrPhysicalGroupComponent } from './online-or-physical-group.component';

describe('OnlineOrPhysicalGroupComponent', () => {
    let fixture: ComponentFixture<OnlineOrPhysicalGroupComponent>;
    let comp: OnlineOrPhysicalGroupComponent;
    let el;
    let mockAppSettingsService, mockFilterService;
    let categories;

    beforeEach(() => {
        mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettings', ['']);
        mockFilterService      = jasmine.createSpyObj<FilterService>('filterService', ['filterStringKidsWelcome']);
        categories = MockTestData.getSomeCategories();

        TestBed.configureTestingModule({
            declarations: [
                OnlineOrPhysicalGroupComponent
            ],
            providers: [
                { provide: AppSettingsService, useValue: mockAppSettingsService },
                { provide: FilterService, useValue: mockFilterService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(OnlineOrPhysicalGroupComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
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
});
