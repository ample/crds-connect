import { HostApplicatonForm } from '../../models/index';
import { Observable } from 'rxjs/Rx';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { ContentService } from 'crds-ng2-content-block';
import { ToastsManager } from 'ng2-toastr';
import { TextMaskModule } from 'angular2-text-mask';

import { StripTagsPipe } from '../../pipes/strip-tags.pipe';
import { DetailedUserData } from '../../models/detailed-user-data';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { MockTestData } from '../../shared/MockTestData';
import { HostApplicationComponent } from './host-application.component';

describe('HostApplicationComponent', () => {
  let fixture: ComponentFixture<HostApplicationComponent>;
  let comp: HostApplicationComponent;
  let el;
  let mockContentService,
    mockLocationService,
    mockRouter,
    mockStateService,
    mockSessionService,
    mockToastsManager;
  let userData: DetailedUserData;

  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['getContent']);
    mockStateService = jasmine.createSpyObj<StateService>('stateService', ['setLoading']);
    mockSessionService = jasmine.createSpyObj<SessionService>('sessionService', ['postHostApplication']);
    mockToastsManager = jasmine.createSpyObj<ToastsManager>('toast', ['error']);
    mockLocationService = jasmine.createSpyObj<Location>('location', ['back']);
    mockRouter = jasmine.createSpyObj<Router>('router', ['navigate']);
    userData = MockTestData.getADetailedUserData();

    TestBed.configureTestingModule({
      declarations: [
        HostApplicationComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: ContentService, useValue: mockContentService },
        { provide: Location, useValue: mockLocationService },
        { provide: StateService, useValue: mockStateService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: ToastsManager, useValue: mockToastsManager },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { userData: userData } } } },
        { provide: Router, useValue: mockRouter },
        StripTagsPipe
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(HostApplicationComponent);
      comp = fixture.componentInstance;

    });
  }));

  it('should create an instance', () => {
    expect(comp).toBeTruthy();
  });

  it('should initially hide the second address form', () => {
    const groupAddressForm = fixture.debugElement.query(By.css('#gatheringAddressForm'));
    expect(groupAddressForm).toBeFalsy();
  });

  it('should init', () => {
    const contentReturned = 'Hey this is some content';
    (mockContentService.getContent).and.returnValue(Observable.of({ content: contentReturned }));
    comp.ngOnInit();
    expect(mockContentService.getContent).toHaveBeenCalledWith('defaultGatheringDesc');
    expect(mockStateService.setLoading).toHaveBeenCalledTimes(1);
    expect(comp['userData']).toBe(userData);
  });

  it('validate phone length - min not met', () => {
    const contentReturned = 'Hey this is some content';
    (mockContentService.getContent).and.returnValue(Observable.of({ content: contentReturned }));
    userData.mobilePhone = '123';
    comp.ngOnInit();
    comp.hostForm.controls['contactNumber'].setValue('123');
    expect(comp.hostForm.controls['contactNumber'].valid).toBeFalsy();
  });

  it('validate phone length - correct length', () => {
    const contentReturned = 'Hey this is some content';
    (mockContentService.getContent).and.returnValue(Observable.of({ content: contentReturned }));
    userData.mobilePhone = '123-456-7890';
    comp.ngOnInit();
    comp.hostForm.controls['contactNumber'].setValue('123-456-7890');
    expect(comp.hostForm.controls['contactNumber'].valid).toBeTruthy();
  });

  it('should convertFormToDto with home address set to true', () => {
    const hostForm = new HostApplicatonForm(1, MockTestData.getAnAddress(1), true, MockTestData.getAnAddress(55), '123-123-1234', 'a desc');
    const result = comp['convertFormToDto'](hostForm, 3);
    expect(result.address.addressId).toBe(1);
    expect(result.contactId).toBe(3);
    expect(result.groupDescription).toBe(hostForm.gatheringDescription);
    expect(result.contactNumber).toBe(hostForm.contactNumber);
  });

  it('should remove address form if not home address', () => {
    const contentReturned = 'Hey this is some content';
    mockContentService.getContent.and.returnValue(Observable.of({ content: contentReturned }));
    comp.ngOnInit();
    spyOn(comp.hostForm, 'removeControl');
    comp.hostForm.value.isHomeAddress = false;
    comp.onIsHomeAddressClicked();
    expect(comp.hostForm.removeControl).toHaveBeenCalledWith(comp.groupNameForGatheringAddress);
  });

  it('should remove address form if not home address', () => {
    const contentReturned = 'Hey this is some content';
    mockContentService.getContent.and.returnValue(Observable.of({ content: contentReturned }));
    comp.ngOnInit();
    spyOn(comp.hostForm, 'removeControl');
    comp.hostForm.value.isHomeAddress = true;
    comp.onIsHomeAddressClicked();
    expect(comp.hostForm.removeControl).not.toHaveBeenCalled();
  });

  it('should submit if valid', () => {
    const value = new HostApplicatonForm(1, null, true, null, null, null);
    spyOn(comp, 'submitFormToApi');
    comp.onSubmit({value: value, valid: true});
    expect(comp.submitFormToApi).toHaveBeenCalledWith(value);
  });

  it('should not submit if invalid', () => {
    const value = new HostApplicatonForm(1, null, true, null, null, null);
    spyOn(comp, 'submitFormToApi');
    comp.onSubmit({value: value, valid: false});
    expect(comp.submitFormToApi).not.toHaveBeenCalled();
  });

  it('should submit to api successfully', () => {
    const contentReturned = 'Hey this is some content';
    mockContentService.getContent.and.returnValue(Observable.of({ content: contentReturned }));
    comp.ngOnInit();
    mockSessionService.postHostApplication.and.returnValue(Observable.of({}));
    const value = new HostApplicatonForm(1, MockTestData.getAnAddress(), true, null, '123-123-1234', 'desc');
    comp.submitFormToApi(value);
    expect(mockSessionService.postHostApplication).toHaveBeenCalledWith(comp['convertFormToDto'](value, 1));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/host-next-steps']);
  });

  it('should submit to api catch error', () => {
    const contentReturned = 'Hey this is some content';
    mockContentService.getContent.and.returnValue(Observable.of({ content: contentReturned }));
    mockSessionService.postHostApplication.and.returnValue(Observable.throw({error: '404'}));
    const value = new HostApplicatonForm(1, MockTestData.getAnAddress(), true, null, '123-123-1234', 'desc');
    spyOn(comp, 'handleError');
    comp.ngOnInit();
    comp.submitFormToApi(value);
    expect(mockSessionService.postHostApplication).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(comp.handleError).toHaveBeenCalledWith({error: '404'});
  });

  it('should handle error duplicate gathering', () => {
    comp.handleError({status: 406});
    expect(mockToastsManager.error).toHaveBeenCalledWith('You cannot host another gathering at the same location. ' +
    'Please change the address and try again!');
  });

  it('should handle all other errors', () => {
    comp.handleError({status: 404});
    expect(mockToastsManager.error).toHaveBeenCalledWith('An error occurred, please try again later.');
  });

  it('should convertFormToDto with home address set to false', () => {
    const hostForm = new HostApplicatonForm(1, MockTestData.getAnAddress(1), false, MockTestData.getAnAddress(55), '123-123-1234', 'a desc');
    const result = comp['convertFormToDto'](hostForm, 3);
    expect(result.address.addressId).toBe(55);
    expect(result.contactId).toBe(3);
    expect(result.groupDescription).toBe(hostForm.gatheringDescription);
    expect(result.contactNumber).toBe(hostForm.contactNumber);
  });
});
