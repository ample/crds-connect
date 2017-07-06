import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs/Rx';

import { AppSettingsService } from '../../services/app-settings.service';
import { PinSearchRequestParams } from '../../models/pin-search-request-params';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';
import { SearchBarComponent } from './search-bar.component';

import { app, placeholderTextForSearchBar } from '../../shared/constants';

class StateServiceStub {
  public myStuffActive: boolean = false;
  setMyViewOrWorldView = jasmine.createSpy('setMyViewOrWorldView').and.returnValue(true);
  public lastSearch = { search: null };
  public myStuffStateChangedEmitter = {
    subscribe: jasmine.createSpy('subscribe').and.returnValue(Observable.of(this.myStuffActive))
  };
};

describe('SearchBarComponent', () => {
  let fixture: ComponentFixture<SearchBarComponent>;
  let comp: SearchBarComponent;
  let el;
  let mockAppSettingsService, mockPinService, mockStateService;

  beforeEach(() => {
    mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettingsService', ['isConnectApp']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['emitPinSearchRequest']);
    mockStateService = new StateServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        SearchBarComponent
      ],
      providers: [
        { provide: AppSettingsService, useValue: mockAppSettingsService },
        { provide: StateService, useValue: mockStateService },
        { provide: PinService, useValue: mockPinService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(SearchBarComponent);
      comp = fixture.componentInstance;
      comp['isMapHidden'] = false;
      // el = fixture.debugElement.query(By.css('h1'));
    });
  }));

  it('should create an instance', () => {
    expect(comp).toBeTruthy();
  });

  it('should init', () => {
    comp.ngOnInit();
    expect(comp.isMyStuffSearch).toBeFalsy();
    expect(mockStateService.myStuffStateChangedEmitter.subscribe).toHaveBeenCalled();
  });

  it('should toggle view', () => {
    expect(comp.buttontext).toBe(undefined);
    comp.toggleView();
    expect(comp.buttontext).toBe('Map');
  });

  it('should emit search event', () => {
    <jasmine.Spy>(mockAppSettingsService.isConnectApp).and.returnValue(true);
    comp.ngOnInit();
    let pinSearch = new PinSearchRequestParams(true, 'Phil is cool!', null);
    mockPinService.emitPinSearchRequest.and.returnValue(true);
    comp.onSearch(pinSearch.userSearchString);
    expect(mockPinService.emitPinSearchRequest).toHaveBeenCalledWith(pinSearch);
    expect(comp.isMyStuffSearch).toBeFalsy();
    expect(mockStateService.setMyViewOrWorldView).toHaveBeenCalledWith('world');
  });

  it('It should set the placeholder text to "Address..." on CONNECT component init', () => {
    <jasmine.Spy>(mockAppSettingsService.isConnectApp).and.returnValue(true);
    comp.ngOnInit();
    expect(comp.placeholderTextForSearchBar).toBe(placeholderTextForSearchBar.ADDRESS);
  });

  it('It should set the placeholder text to "Keyword..." on GROUPS component init', () => {
    <jasmine.Spy>(mockAppSettingsService.isConnectApp).and.returnValue(false);
    comp.ngOnInit();
    expect(comp.placeholderTextForSearchBar).toBe(placeholderTextForSearchBar.KEYWORD);
  });

});
