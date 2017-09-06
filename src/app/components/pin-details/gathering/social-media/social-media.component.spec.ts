import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

import { SocialMediaComponent } from './social-media.component';



describe('LeaderResourcesComponent', () => {
    let fixture: ComponentFixture<SocialMediaComponent>;
    let comp: SocialMediaComponent;

    let mockToastsManager;

    beforeEach(() => {

        mockToastsManager = jasmine.createSpyObj<ToastsManager>('toastsManager', ['constructor', 'success']);

        TestBed.configureTestingModule({
            declarations: [
                SocialMediaComponent
            ],
            providers: [
                { provide: ToastsManager, useValue: mockToastsManager }],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SocialMediaComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('SocialMediaComponent should exist', () => {
        expect(comp).toBeTruthy();
    });

    it('copyURL should call toast', () => {
        comp.copyURL('theurl');
        expect(mockToastsManager.success).toHaveBeenCalled();
    });

});
