import { SearchOptions } from '../../../models/index';
import { StateService } from '../../../services/state.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LocationBarComponent } from './location-bar.component';

describe('LocationBarComponent', () => {
    let fixture: ComponentFixture<LocationBarComponent>;
    let comp: LocationBarComponent;
    let el;
    let mockStateService;

    beforeEach(() => {
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
        mockStateService.lastSearch = new SearchOptions('', '', '');
        TestBed.configureTestingModule({
            declarations: [
                LocationBarComponent
            ],
            providers: [
              { provide: StateService, useValue: mockStateService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(LocationBarComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should enter the assertion', () => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    });

    it('should init', () => {
      comp['state'].lastSearch = new SearchOptions('search', '', 'location');
      comp.ngOnInit();
      expect(comp.locationFormGroup.controls['location'].value).toBe('location');
    });

    it('should submit', () => {
      spyOn(comp.submit, 'emit');
      comp.onSubmit();
      expect(comp.submit.emit).toHaveBeenCalled();
    });
});
