import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { StateService } from '../../../services/state.service';
import { AddressService } from '../../../services/address.service';
import { ToastsManager } from 'ng2-toastr';
import { MockTestData } from '../../../shared/MockTestData';

import { PersonComponent } from './person.component';
import { pinType } from '../../../models/pin';

describe('PersonComponent', () => {
  let fixture: ComponentFixture<PersonComponent>;
  let comp: PersonComponent;
  let el;

  let mockContentService, mockToast, mockStateService, mockAddressService, mockRouter;

  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);
    mockAddressService = jasmine.createSpyObj<AddressService>('addressService', ['getFullAddress']);
    mockToast = jasmine.createSpyObj<ToastsManager>('toast', ['warning', 'error']);
    mockStateService = jasmine.createSpyObj<StateService>('state', ['setLoading', 'setPageHeader']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [
        PersonComponent
      ],
      providers: [
        { provide: AddressService, useValue: mockAddressService },
        { provide: ContentService, useValue: mockContentService },
        { provide: StateService, useValue: mockStateService },
        { provide: ToastsManager, useValue: mockToast },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(PersonComponent);
      comp = fixture.componentInstance;
      comp['pin'] = MockTestData.getAPin(1);
      // el = fixture.debugElement.query(By.css('h1'));
    });
  }));

  it('should create an instance', () => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should init logged in as not a pinOwner', () => {
    comp.isPinOwner = false;
    comp.isLoggedIn = true;
    comp.ngOnInit();
  });

  it('should init logged in as the pin owner', () => {
    comp.isPinOwner = true;
    comp.isLoggedIn = true;
    const expectedAddress = MockTestData.getAnAddress();
    mockAddressService.getFullAddress.and.returnValue(Observable.of(expectedAddress));

    comp.ngOnInit();

    expect(comp.pin.address).toBe(expectedAddress);
    expect(mockAddressService.getFullAddress).toHaveBeenCalledWith(1, pinType.PERSON);
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(2);
  });

  it('should toast an error when pin owner and getFullAddress fails', () => {
    comp.isPinOwner = true;
    comp.isLoggedIn = true;
    const expectedText = '<p>Error loading address</p>';

    mockContentService.getContent.and.returnValue(Observable.of({ content: expectedText }));
    mockAddressService.getFullAddress.and.returnValue(Observable.throw({ status: 500 }));

    comp.ngOnInit();
    expect(mockToast.error).toHaveBeenCalledWith(expectedText);
  });
});
