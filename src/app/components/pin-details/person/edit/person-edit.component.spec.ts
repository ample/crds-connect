import { pinType } from '../../../../models/pin';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../../../../services/address.service';
import { PinService } from '../../../../services/pin.service';
import { StateService } from '../../../../services/state.service';
import { ToastsManager } from 'ng2-toastr';
import { BlandPageCause, BlandPageDetails, BlandPageType } from '../../../../models/bland-page-details';
import { BlandPageService } from '../../../../services/bland-page.service';
import { MockComponent } from '../../../../shared/mock.component';
import { SessionService } from '../../../../services/session.service';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTestData } from '../../../../shared/MockTestData';

import { PersonEditComponent } from './person-edit.component';

describe('PersonEditComponent', () => {
    let fixture: ComponentFixture<PersonEditComponent>;
    let comp: PersonEditComponent;
    let el;
    let pin;
    let mockSessionService,
        mockBlandPageService,
        mockToastr,
        mockStateService,
        mockContentService,
        mockPinService,
        mockAddressService,
        mockRouter;

    beforeEach(() => {
        pin = MockTestData.getAPin();
        mockSessionService = { getContactId: jest.fn() };
        mockBlandPageService = { primeAndGo: jest.fn() };
        mockToastr = { success: jest.fn(), error: jest.fn() };
        mockStateService = { setPageHeader: jest.fn(), setLoading: jest.fn() };
        mockContentService = { getContent: jest.fn() };
        mockPinService = { postPin: jest.fn() };
        mockAddressService = { getFullAddress: jest.fn(), clearCache: jest.fn() };
        mockRouter = { navigate: jest.fn() };
        TestBed.configureTestingModule({
            declarations: [
                PersonEditComponent,
                MockComponent({ selector: 'address-form', inputs: ['parentForm', 'isFormSubmitted', 'groupName', 'address'] }),
                MockComponent({ selector: 'crds-content-block', inputs: ['id']})
            ],
            imports: [
                RouterTestingModule.withRoutes([]),
            ],
            providers: [
                { provide: SessionService, useValue: mockSessionService },
                { provide: BlandPageService, useValue: mockBlandPageService },
                { provide: ToastsManager, useValue: mockToastr },
                { provide: StateService, useValue: mockStateService },
                { provide: ContentService, useValue: mockContentService },
                { provide: PinService, useValue: mockPinService },
                { provide: AddressService, useValue: mockAddressService },
                { provide: Router, useValue: mockRouter },
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { data: { pin: pin } } },
                },
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(PersonEditComponent);
            comp = fixture.componentInstance;
            comp.pin = pin;
            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('should instantiate', () => {
        mockAddressService.getFullAddress.mockReturnValue(Observable.of(MockTestData.getAnAddress()));
        fixture.detectChanges();
        expect(comp).toBeTruthy();
    });

    it('should init', () => {
        let address = MockTestData.getAnAddress(3);
        mockAddressService.getFullAddress.mockReturnValue(Observable.of(address));
        mockSessionService.getContactId.mockReturnValue(1);
        comp.ngOnInit();
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
        expect(mockAddressService.getFullAddress).toHaveBeenCalledWith(pin.gathering.groupId, pinType.PERSON);
        expect(comp['ready']).toBe(true);
        expect(comp['pin'].address).toBe(address);
        expect(mockSessionService.getContactId).toHaveBeenCalledTimes(1);
    });

    it('should init with getFullAddress failure', () => {
        mockAddressService.getFullAddress.mockReturnValue(Observable.throw({}));
        let expectedError = 'Lets get ready to party';
        mockContentService.getContent.mockReturnValue(expectedError);
        mockSessionService.getContactId.mockReturnValue(1);
        comp.ngOnInit();
        expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
        expect(mockAddressService.getFullAddress).toHaveBeenCalledWith(pin.participantId, pinType.PERSON);
        expect(comp['ready']).toBe(true);
        expect(mockToastr.error).toHaveBeenCalledWith(expectedError);
        expect(mockSessionService.getContactId).toHaveBeenCalledTimes(1);
    });

    it('should redirect to blandPage if logged in user doesnt own pin', () => {
        let address = MockTestData.getAnAddress(3);
        let expectedBpd = new BlandPageDetails(
            'Return to map',
            'Sorry you do not own the pin being edited',
            BlandPageType.Text,
            BlandPageCause.Error,
            '',
            ''
        );
        mockAddressService.getFullAddress.mockReturnValue(Observable.of(address));
        mockSessionService.getContactId.mockReturnValue(42);
        comp.ngOnInit();
        expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBpd);
    });

    it('should submit', () => {
        let expectedToast = 'Yay we did it';
        let newPin = MockTestData.getAPin(1);

        newPin.address = MockTestData.getAnAddress(42);
        mockPinService.postPin.mockReturnValue(Observable.of(newPin));
        mockContentService.getContent.mockReturnValue(expectedToast);
        expect(comp.pin.address.addressId).toBe(1);

        comp.onSubmit();
        expect(mockPinService.postPin).toHaveBeenCalledWith(pin);
        expect(comp.pin.address.addressId).toBe(42);
        expect(mockToastr.success).toHaveBeenCalledWith(expectedToast);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/person', pin.participantId]);
        expect(mockAddressService.clearCache).toHaveBeenCalled();
        expect(comp['submitting']).toBe(false);
    });

    it('should fail to submit gracefully', () => {
        let expectedToast = 'Something error happens';
        mockContentService.getContent.mockReturnValue(expectedToast);
        mockPinService.postPin.mockReturnValue(Observable.throw({}));
        comp.onSubmit();
        expect(comp['submitting']).toBe(false);
        expect(mockToastr.error).toHaveBeenCalledWith(expectedToast);
        expect(comp['submissionError']).toBe(true);
    });

     it('should cancel', () => {
        comp.cancel();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/person', pin.participantId]);
    });
});
