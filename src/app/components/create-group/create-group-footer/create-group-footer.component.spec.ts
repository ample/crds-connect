import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr';
import { ModalModule } from 'ngx-bootstrap';

import { CreateGroupService } from '../create-group-data.service';
import { CreateGroupFooterComponent } from './create-group-footer.component';

import { ModalDirective } from 'ngx-bootstrap/modal';

describe('CreateGroupFooterComponent', () => {
    let fixture: ComponentFixture<CreateGroupFooterComponent>;
    let comp: CreateGroupFooterComponent;
    let el;

    let mockRouter, mockModal, mockCreateGroupService;
    let mockBlandPageService, mockStateService, mockToast, mockAppSettings, mockParticipantService;

    beforeEach(() => {
        mockRouter = jasmine.createSpyObj<Router>('router', ['']);
        mockCreateGroupService = jasmine.createSpyObj<CreateGroupService>('createGroupService', ['reset']);

        mockModal = jasmine.createSpyObj<ModalDirective>('md', ['show']);

        TestBed.configureTestingModule({
            imports: [
                ModalModule.forRoot()
            ],
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

    it('should show modal', () => {
        comp.cancelModal = jasmine.createSpyObj<ModalDirective>('modalDir', ['show', 'hide']);
        comp.OnCancel();
        expect(comp.cancelModal.show).toHaveBeenCalled();
    });

    it('should hide modal', () => {
        comp.cancelModal = jasmine.createSpyObj<ModalDirective>('modalDir', ['show', 'hide']);
        comp.cancelDeclined();
        expect(comp.cancelModal.hide).toHaveBeenCalled();
    });
});
