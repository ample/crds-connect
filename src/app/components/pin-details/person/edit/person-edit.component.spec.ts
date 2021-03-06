import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../../../../services/address.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlandPageCause, BlandPageDetails, BlandPageType, pinType } from '../../../../models';
import { BlandPageService } from '../../../../services/bland-page.service';
import { By } from '@angular/platform-browser';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { DebugElement } from '@angular/core';
import { MockComponent } from '../../../../shared/mock.component';
import { MockTestData } from '../../../../shared/MockTestData';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { PersonEditComponent } from './person-edit.component';
import { PinService } from '../../../../services/pin.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../../../../services/session.service';
import { StateService } from '../../../../services/state.service';
import { ToastsManager } from 'ng2-toastr';

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
    mockSessionService = jasmine.createSpyObj<SessionService>('session', ['getContactId']);
    mockBlandPageService = jasmine.createSpyObj<BlandPageService>('blandPageService', ['primeAndGo']);
    mockToastr = jasmine.createSpyObj<ToastsManager>('toastr', ['success', 'error']);
    mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader', 'setCurrentView',
      'getCurrentView', 'setLastSearch']);
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['postPin']);
    mockAddressService = jasmine.createSpyObj<AddressService>('addressService', ['getFullAddress', 'clearCache']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [
        PersonEditComponent,
        MockComponent({ selector: 'address-form', inputs: ['parentForm', 'isFormSubmitted', 'groupName', 'address'] }),
        MockComponent({ selector: 'crds-content-block', inputs: ['id'] })
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
      schemas: [NO_ERRORS_SCHEMA]
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
    mockAddressService.getFullAddress.and.returnValue(Observable.of(MockTestData.getAnAddress()));
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should init', () => {
    const address = MockTestData.getAnAddress(3);
    mockAddressService.getFullAddress.and.returnValue(Observable.of(address));
    mockSessionService.getContactId.and.returnValue(1);
    comp.ngOnInit();
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    expect(mockAddressService.getFullAddress).toHaveBeenCalledWith(pin.gathering.groupId, pinType.PERSON);
    expect(comp['ready']).toBe(true);
    expect(comp['pin'].address).toBe(address);
    expect(mockSessionService.getContactId).toHaveBeenCalledTimes(1);
  });

  it('should init with getFullAddress failure', () => {
    mockAddressService.getFullAddress.and.returnValue(Observable.throw({}));
    const expectedError = 'Lets get ready to party';
    mockContentService.getContent.and.returnValue(Observable.of({ content: expectedError }));
    mockSessionService.getContactId.and.returnValue(1);
    comp.ngOnInit();
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
    expect(mockAddressService.getFullAddress).toHaveBeenCalledWith(pin.participantId, pinType.PERSON);
    expect(comp['ready']).toBe(true);
    expect(mockToastr.error).toHaveBeenCalledWith(expectedError);
    expect(mockSessionService.getContactId).toHaveBeenCalledTimes(1);
  });

  it('should redirect to blandPage if logged in user doesnt own pin', () => {
    const address = MockTestData.getAnAddress(3);
    const expectedBpd = new BlandPageDetails(
      'Return to map',
      'Sorry you do not own the pin being edited',
      BlandPageType.Text,
      BlandPageCause.Error,
      '',
      ''
    );
    mockAddressService.getFullAddress.and.returnValue(Observable.of(address));
    mockSessionService.getContactId.and.returnValue(42);
    comp.ngOnInit();
    expect(mockBlandPageService.primeAndGo).toHaveBeenCalledWith(expectedBpd);
  });

  it('should submit', () => {
    const expectedToast = 'Yay we did it';
    const newPin = MockTestData.getAPin(1);

    newPin.address = MockTestData.getAnAddress(42);
    mockPinService.postPin.and.returnValue(Observable.of(newPin));
    mockContentService.getContent.and.returnValue(Observable.of({ content: expectedToast }));
    expect(comp.pin.address.addressId).toBe(1);

    comp.onSubmit();
    expect(mockPinService.postPin).toHaveBeenCalledWith(pin);
    expect(comp.pin.address.addressId).toBe(42);
    expect(mockToastr.success).toHaveBeenCalledWith(expectedToast);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/person', pin.participantId]);
    expect(mockAddressService.clearCache).toHaveBeenCalled();
    expect(mockStateService.setLastSearch).toHaveBeenCalledWith(null);
    expect(comp['submitting']).toBe(false);
  });

  it('should fail to submit gracefully', () => {
    const expectedToast = 'Something error happens';
    mockContentService.getContent.and.returnValue(Observable.of({ content: expectedToast }));
    mockPinService.postPin.and.returnValue(Observable.throw({}));
    comp.onSubmit();
    expect(comp['submitting']).toBe(false);
    expect(mockToastr.error).toHaveBeenCalledWith(expectedToast);
    expect(comp['submissionError']).toBe(true);
  });

  it('should cancel', () => {
    comp.cancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/person', pin.participantId]);
  });

  it('should navigate to remove-person-pin when remove link clicked', () => {
    comp.removePersonPin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/remove-person-pin', pin.participantId]);
  });
});
