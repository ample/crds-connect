import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CreateGroupService } from '../create-group-data.service';
import { CreateGroupFooterComponent } from './create-group-footer.component';


describe('CreateGroupFooterComponent', () => {
    let fixture: ComponentFixture<CreateGroupFooterComponent>;
    let comp: CreateGroupFooterComponent;
    let el;

    let mockRouter, mockModal, mockCreateGroupService;
    let mockBlandPageService, mockStateService, mockToast, mockAppSettings, mockParticipantService;

    beforeEach(() => {
        mockRouter = jasmine.createSpyObj<Router>('router', ['']);
        mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('createGroupService', ['reset']);

        TestBed.configureTestingModule({
            declarations: [
                CreateGroupFooterComponent
            ],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: CreateGroupService, useValue: mockCreateGroupService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(CreateGroupFooterComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('CreateGroupFooterComponent should exist', () => {
        expect(comp).toBeTruthy();
    });

    it('should show fauxdal', () => {
        comp.OnCancel();
        expect(comp.showFauxdal).toBeTruthy();
    });

    it('should hide fauxdal', () => {
        comp.showFauxdal = true;
        comp.cancelDeclined();
        expect(comp.showFauxdal).toBeFalsy();
    });
});
