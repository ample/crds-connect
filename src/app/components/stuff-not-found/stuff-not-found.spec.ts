import { MockComponent } from '../../shared/mock.component';
import { StateService } from '../../services/state.service';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StuffNotFoundComponent } from './stuff-not-found.component';

describe('StuffNotFoundComponent', () => {
    let fixture: ComponentFixture<StuffNotFoundComponent>;
    let comp: StuffNotFoundComponent;
    let el;
    let mockStateService;

    beforeEach(() => {
        mockStateService = jasmine.createSpyObj('state', ['setLoading', 'setPageHeader']);
        TestBed.configureTestingModule({
            declarations: [
                StuffNotFoundComponent,
                MockComponent({selector: 'crds-content-block', inputs: ['id']})
            ],
            providers: [
                { provide: StateService, useValue: mockStateService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(StuffNotFoundComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should create an instance', () => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('my stuff', '/');

    });
});
