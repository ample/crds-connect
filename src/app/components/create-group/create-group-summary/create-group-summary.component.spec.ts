import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StateService } from '../../../services/state.service';
import { CreateGroupSummaryComponent } from './create-group-summary.component';

describe('CreateGroupSummaryComponent', () => {
    let fixture: ComponentFixture<CreateGroupSummaryComponent>;
    let comp: CreateGroupSummaryComponent;
    let el;
    let mockStateService;

    beforeEach(() => {
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setPageHeader', 'setLoading']);
        TestBed.configureTestingModule({
            declarations: [
                CreateGroupSummaryComponent
            ],
            providers: [
                { provide: StateService, useValue: mockStateService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CreateGroupSummaryComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should instantiate', () => {
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    });

    it('should init', () => {
        comp.ngOnInit();
        expect(mockStateService.setPageHeader).toHaveBeenCalledWith('start a group', '/');
        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    });
});
