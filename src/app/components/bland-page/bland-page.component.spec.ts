/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ContentService } from '../../services/content.service';
import { BlandPageService } from '../../services/bland-page.service';
import { StateService } from '../../services/state.service';

import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../models/bland-page-details';

import { BlandPageComponent } from './bland-page.component';

describe('BlandPageComponent', () => {
    let fixture: ComponentFixture<BlandPageComponent>;
    let comp: BlandPageComponent;
    let mockContentService, mockBlandPageService, mockStateService, mockRouter;

    beforeEach(() => {
        mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContactId']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['getBlandPageDetails']);
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
        mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [
                BlandPageComponent
            ],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: ContentService, useValue: mockContentService },
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

    fit('should create an instance', () => {
        expect(comp).toBeTruthy();
    });

    fit('should init and is type content block', () => {
        comp.contentBlock = false;
        let bpd = new BlandPageDetails('','','',BlandPageType.ContentBlock, BlandPageCause.Success);
        (<jasmine.Spy>mockBlandPageService.getBlandPageDetails).and.returnValue(bpd);
        comp.ngOnInit();
        expect(mockBlandPageService.getBlandPageDetails).toHaveBeenCalled();
        expect(comp.contentBlock).toBe(true);
        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    });

    fit('should init and is type text', () => {
        comp.contentBlock = true;
        let bpd = new BlandPageDetails('','','',BlandPageType.Text, BlandPageCause.Success);
        (<jasmine.Spy>mockBlandPageService.getBlandPageDetails).and.returnValue(bpd);
        comp.ngOnInit();
        expect(mockBlandPageService.getBlandPageDetails).toHaveBeenCalled();
        expect(comp.contentBlock).toBe(false);
        expect(mockStateService.setLoading).toHaveBeenCalledWith(false);
    });

    fit('should close', () => {
        comp['blandPageDetails'] = new BlandPageDetails('','','home',BlandPageType.Text, BlandPageCause.Success);
        comp.close();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });
});
