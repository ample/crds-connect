/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { Location } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';
import { Observable } from 'rxjs';

import { BlandPageService } from '../../../../services/bland-page.service';
import { ParticipantService } from '../../../../services/participant.service';
import { StateService } from '../../../../services/state.service';
import { MockTestData } from '../../../../shared/MockTestData';
import { ParticipantRemoveComponent } from './participant-remove.component';

class ActivatedRouteStub {
    public params = Observable.of({ groupId: 1234, groupParticipantId: 1 });

    set testParams(params: any) {
        this.params = Observable.of(params);
    }
}

class RouterStub {
    navigate = jasmine.createSpy('navigate');

    public url = '/small-group/1234/participant/1';

    set TestUrl(url: string) {
        this.url = url;
    }
}

describe('ParticipantRemoveComponent', () => {
    let fixture: ComponentFixture<ParticipantRemoveComponent>;
    let comp: ParticipantRemoveComponent;
    let el;
    let mockParticipantService, mockActivatedRoute, mockStateService,
        mockLocationService, mockRouter, mockToastsManager, mockBlandPageService,
        mockContentService;

    beforeEach(() => {
        mockParticipantService = jasmine.createSpyObj<ParticipantService>('participantService', ['getGroupParticipant', 'removeParticipant']);
        mockActivatedRoute = new ActivatedRouteStub();
        mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading']);
        mockLocationService = jasmine.createSpyObj<Location>('location', ['back']);
        mockRouter = new RouterStub();
        mockToastsManager = jasmine.createSpyObj<ToastsManager>('toast', ['error']);
        mockBlandPageService = jasmine.createSpyObj<BlandPageService>('bps', ['goToDefaultError']);
        mockContentService = jasmine.createSpyObj<ContentService>('contentService', ['getContent']);
        TestBed.configureTestingModule({
            declarations: [
                ParticipantRemoveComponent
            ],
            providers: [
                { provide: ParticipantService, useValue: mockParticipantService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: StateService, useValue: mockStateService },
                { provide: Location, useValue: mockLocationService },
                { provide: Router, useValue: mockRouter },
                { provide: ToastsManager, useValue: mockToastsManager },
                { provide: ContentService, useValue: mockContentService },
                { provide: BlandPageService, useValue: mockBlandPageService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ParticipantRemoveComponent);
            comp = fixture.componentInstance;

            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    fit('should init happy path', () => {
        (mockParticipantService.getGroupParticipant).and.returnValue(Observable.of(MockTestData.getAParticipantsArray()[1]));
        fixture.detectChanges();
        expect(comp).toBeTruthy();
        expect(mockParticipantService.getGroupParticipant).toHaveBeenCalledWith(1234, 1);
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
        expect(comp['redirectUrl']).toBe('/small-group/1234');
    });

    fit('should handle participant not found in group on init', () => {
        (mockParticipantService.getGroupParticipant).and.returnValue(Observable.throw({error: 'nooo'}));
        spyOn(comp, 'handleError');
        fixture.detectChanges();

        expect(mockParticipantService.getGroupParticipant).toHaveBeenCalledTimes(1);
        expect(comp['handleError']).toHaveBeenCalledTimes(1);
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    });

    fit('closeClick should take you back', () => {
        comp.closeClick();
        expect(mockLocationService.back).toHaveBeenCalledTimes(1);
    });

    fit('onSubmit successfully', () => {
        comp['groupId'] = 42;
        comp['groupParticipantId'] = 99;
        comp['redirectUrl'] = 'test';
        comp['message'] = 'The best message';

        (mockParticipantService.removeParticipant).and.returnValue(Observable.of({}));
        comp.onSubmit();
        expect(mockParticipantService.removeParticipant).toHaveBeenCalledWith(42, 99, 'The best message');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['test']);
    });

    fit('onSubmit failure should toast', () => {
        comp['groupId'] = 42;
        comp['groupParticipantId'] = 99;
        comp['redirectUrl'] = 'test';
        comp['message'] = 'The best message';
        (mockParticipantService.removeParticipant).and.returnValue(Observable.throw({error: 'crap'}));
        (mockContentService.getContent).and.returnValue('Something error happens');
        comp.onSubmit();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        expect(mockContentService.getContent).toHaveBeenCalledWith('groupToolRemoveParticipantFailure');
        expect(mockToastsManager.error).toHaveBeenCalledWith('Something error happens');
    });

    fit('handle error should go to default bland page error', () => {
        comp['redirectUrl'] = 'stuff';
        comp['handleError']();
        expect(mockBlandPageService.goToDefaultError).toHaveBeenCalledWith('stuff');
    });
});
