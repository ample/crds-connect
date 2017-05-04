/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BlandPageService } from '../../services/bland-page.service';
import { StateService } from '../../services/state.service';

import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../models/bland-page-details';

import { BlandPageComponent } from './bland-page.component';

describe('BlandPageComponent', () => {
    let fixture: ComponentFixture<BlandPageComponent>;
    let comp: BlandPageComponent;
    let mockBlandPageService, mockStateService, mockRouter;

    beforeEach(() => {
        mockBlandPageService = { getBlandPageDetails: jest.fn() };
        mockStateService = { setLoading: jest.fn() };
        mockRouter = { navigate: jest.fn() };

        TestBed.configureTestingModule({
            declarations: [
                BlandPageComponent
            ],
            providers: [
                { provide: ActivatedRoute, useValue: { snapshot: { data: [{ isFauxdal: true }] }} },
                { provide: Router, useValue: mockRouter },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: StateService, useValue: mockStateService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(BlandPageComponent);
            comp = fixture.componentInstance;
        });
    }));

    it('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should init and is type content block', () => {
        comp.contentBlock = false;
        let bpd = new BlandPageDetails('', '', BlandPageType.ContentBlock, BlandPageCause.Success, '');
        mockBlandPageService.getBlandPageDetails.mockReturnValue(bpd);
        comp.ngOnInit();
        expect(mockBlandPageService.getBlandPageDetails).toHaveBeenCalled();
        expect(comp.contentBlock).toBe(true);
        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    });

    it('should init and is type text', () => {
        comp.contentBlock = true;
        let bpd = new BlandPageDetails('', '', BlandPageType.Text, BlandPageCause.Success, '');
        mockBlandPageService.getBlandPageDetails.mockReturnValue(bpd);
        comp.ngOnInit();
        expect(mockBlandPageService.getBlandPageDetails).toHaveBeenCalled();
        expect(comp.contentBlock).toBe(false);
        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    });

    it('should close', () => {
        comp['blandPageDetails'] = new BlandPageDetails('', '', BlandPageType.Text, BlandPageCause.Success, 'home');
        comp.close();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should attach class selector to body element after view init', () => {
        // Start fresh...
        document.querySelector('body').classList.remove('fauxdal-open');

        expect(document.querySelector('body').classList).not.toContain('fauxdal-open');
        comp.ngAfterViewInit();
        expect(document.querySelector('body').classList).toContain('fauxdal-open');

        // Cleanup...
        document.querySelector('body').classList.remove('fauxdal-open');
    });
});
