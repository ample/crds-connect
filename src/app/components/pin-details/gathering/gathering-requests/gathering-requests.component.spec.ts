/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { MockTestData } from '../../../../shared/MockTestData';
import { Observable } from 'rxjs/Rx';

import { GatheringRequestsComponent } from './gathering-requests.component';

import { Inquiry } from '../../../../models/inquiry';
import { Pin } from '../../../../models/pin';
import { Participant } from '../../../../models/participant';
import { BlandPageDetails, BlandPageType, BlandPageCause } from '../../../../models/bland-page-details';

import { GroupService } from '../../../../services/group.service';
import { BlandPageService } from '../../../../services/bland-page.service';
import { StateService } from '../../../../services/state.service';


describe('GatheringRequestsComponent', () => {
    let fixture: ComponentFixture<GatheringRequestsComponent>;
    let comp: GatheringRequestsComponent;
    let el;
    let mockGroupService,
        mockBlandPageService,
        mockStateService;

    beforeEach(() => {
        mockStateService = { setLoading: jest.fn() };
        mockBlandPageService = {primeAndGo: jest.fn(), goToDefaultError: jest.fn() };
        mockGroupService = {getGroupRequests: jest.fn(), acceptOrDenyRequest: jest.fn() };

        TestBed.configureTestingModule({
            declarations: [
                GatheringRequestsComponent
            ],
            imports: [],
            providers: [
                { provide: StateService, useValue: mockStateService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: GroupService, useValue: mockGroupService }],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GatheringRequestsComponent);
            comp = fixture.componentInstance;
            comp.pin = MockTestData.getAPin(1);
            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should create instance', () => {
        expect(comp).toBeTruthy();
    });

    it('should init and filter out placed inquiries', () => {
        mockGroupService.getGroupRequests.mockReturnValue(Observable.of([{ inquiryId: 1 }, { inquiryId: 2 },
        { inquiryId: 3, placed: true }]));
        mockStateService.setLoading.mockReturnValue(true);
        comp.ngOnInit();
        expect(comp['inquiries'].length).toBe(2);
        expect(mockGroupService.getGroupRequests).toHaveBeenCalledTimes(1);
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should set errorRetrieving on getGroupRequests error', () => {
        mockGroupService.getGroupRequests.mockReturnValue(Observable.throw({}));
        comp.ngOnInit();
        expect(comp['errorRetrieving']).toBeTruthy();
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should convert inquiry to participant', () => {
        let inquiry = new Inquiry(1, 'theemail@email.com', null, 'Joe', 'Ker', new Date(2002), false, 42, 1, null);
        let participant = comp.convertToParticipant(inquiry);
        expect(participant.contactId).toBe(1);
        expect(participant.lastName).toBe('Ker');
        expect(participant.nickName).toBe('Joe');
    });

    it('should accept Invitation', () => {
        mockGroupService.acceptOrDenyRequest.mockReturnValue(Observable.of([{}]));
        mockStateService.setLoading.mockReturnValue(true);
        let inquiry = new Inquiry(1, 'theemail@email.com', null, 'Joe', 'Ker', new Date(2002), false, 42, 1, null);
        comp.acceptOrDenyInquiry(inquiry, true);

        let expectedBPD = new BlandPageDetails(
            'Return to my pin',
            // tslint:disable-next-line:max-line-length
            '<h1 class="title">Request accepted</h1><p>Joe K. has been notified.</p>',
            BlandPageType.Text,
            BlandPageCause.Success,
            'gathering/' + comp.pin.gathering.groupId
        );

        expect(mockGroupService.acceptOrDenyRequest).toHaveBeenCalledWith(comp.pin.gathering.groupId,
            comp.pin.gathering.groupTypeId, true, inquiry);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBPD);
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    });

    it('should deny Invitation', () => {
        mockGroupService.acceptOrDenyRequest.mockReturnValue(Observable.of([{}]));
        mockStateService.setLoading.mockReturnValue(true);
        let inquiry = new Inquiry(1, 'theemail@email.com', null, 'Joe', 'Ker', new Date(2002), false, 42, 1, null);
        comp.acceptOrDenyInquiry(inquiry, false);

        let expectedBPD = new BlandPageDetails(
            'Return to my pin',
            // tslint:disable-next-line:max-line-length
            '<h1 class="title">Request Denied</h1><p>Joe K. has been notified.</p>',
            BlandPageType.Text,
            BlandPageCause.Success,
            'gathering/' + comp.pin.gathering.groupId
        );

        expect(mockGroupService.acceptOrDenyRequest).toHaveBeenCalledWith(comp.pin.gathering.groupId,
            comp.pin.gathering.groupTypeId, false, inquiry);
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBPD);
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    });

    it('accept/deny invitation should handle error', () => {
        mockGroupService.acceptOrDenyRequest.mockReturnValue(Observable.throw({ status: 500 }));
        let inquiry = new Inquiry(1, 'theemail@email.com', null, 'Joe', 'Ker', new Date(2002), false, 42, 1, null);
        comp.acceptOrDenyInquiry(inquiry, false);

        expect(inquiry.error).toBeTruthy();
        expect(mockBlandPageService.primeAndGo).not.toHaveBeenCalled();
        expect(mockBlandPageService.goToDefaultError).not.toHaveBeenCalled();
    });

    it('should return inquiries', () => {
        let inquiries = [MockTestData.getAnInquiry(1), MockTestData.getAnInquiry(2)];
        comp['inquiries'] = inquiries;
        expect(comp.getInquiries()).toBe(inquiries);
    });
});
