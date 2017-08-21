import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CreateGroupService } from '../create-group-data.service';
import { CreateGroupFooterComponent } from './create-group-footer.component';
import { StateService } from '../../../services/state.service';

import { groupPaths } from '../../../shared/constants';

describe('CreateGroupFooterComponent', () => {
    let fixture: ComponentFixture<CreateGroupFooterComponent>;
    let comp: CreateGroupFooterComponent;
    let el;

    let mockRouter, mockStateService, mockCreateGroupService;

    beforeEach(() => {
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
        mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('createGroupService', ['reset', 'getActiveGroupPath']);
        mockStateService= jasmine.createSpyObj<StateService>('state', ['getActiveGroupPath']);

        TestBed.configureTestingModule({
            declarations: [
                CreateGroupFooterComponent
            ],
            providers: [
                { provide: StateService, useValue: mockStateService },
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

    it('should navigate back to the group being added', () => {
      comp.showFauxdal = true;
      (mockStateService.getActiveGroupPath).and.returnValue(groupPaths.ADD);
      comp.cancelConfirmed();
      expect(mockRouter.navigate).toHaveBeenCalledWith([`/create-group`]);
    });
});
