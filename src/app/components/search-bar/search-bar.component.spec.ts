import { MockComponent } from '../../shared/mock.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs/Rx';

import { AppSettingsService } from '../../services/app-settings.service';
import { PinSearchRequestParams } from '../../models/pin-search-request-params';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';
import { FilterService } from '../../services/filter.service';
import { SearchBarComponent } from './search-bar.component';

class StateServiceStub {
  public myStuffActive: boolean = false;
  setMyViewOrWorldView = jasmine.createSpy('setMyViewOrWorldView').and.returnValue(true);
  setIsFilterDialogOpen = jasmine.createSpy('setIsFilterDialogOpen').and.returnValue(true);
  public lastSearch = { search: null };
  public myStuffStateChangedEmitter = {
    subscribe: jasmine.createSpy('subscribe').and.returnValue(Observable.of(this.myStuffActive))
  };
  getIsFilteredDialogOpen = jasmine.createSpy('getIsFilteredDialogOpen');
};

describe('SearchBarComponent', () => {
  let fixture: ComponentFixture<SearchBarComponent>;
  let comp: SearchBarComponent;
  let el;
  let mockAppSettingsService, mockPinService, mockStateService, mockFilterService;

  beforeEach(() => {
    mockAppSettingsService = jasmine.createSpyObj<AppSettingsService>('appSettingsService', ['isConnectApp', 'isSmallGroupApp']);
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['emitPinSearchRequest']);
    mockFilterService = jasmine.createSpyObj<FilterService>('filterService', ['buildFilters']);
    mockStateService = new StateServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        SearchBarComponent,
        MockComponent({selector: 'app-location-bar', inputs: ['submit']})
      ],
      providers: [
        { provide: AppSettingsService, useValue: mockAppSettingsService },
        { provide: StateService, useValue: mockStateService },
        { provide: PinService, useValue: mockPinService },
        { provide: FilterService, useValue: mockFilterService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(SearchBarComponent);
      comp = fixture.componentInstance;
      comp['isMapHidden'] = false;
      // el = fixture.debugElement.query(By.css('form'));
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
    mockStateService.getCurrentView = jasmine.createSpy('getCurrentView');

    expect(comp.isMapHidden).toEqual(false);

    comp.toggleView();
    expect(comp.isMapHidden).toEqual(true);

    comp.toggleView();
    expect(comp.isMapHidden).toEqual(false);
  });

  it('should emit search event', () => {
    <jasmine.Spy>(mockAppSettingsService.isConnectApp).and.returnValue(true);
    comp.ngOnInit();
    spyOn(comp, 'showLocationBar');
    const pinSearch = new PinSearchRequestParams('Phil is cool!', null, undefined);
    mockPinService.emitPinSearchRequest.and.returnValue(true);

    comp.onSearch(pinSearch.userLocationSearchString);
    expect(mockPinService.emitPinSearchRequest).toHaveBeenCalledWith(pinSearch);
    expect(comp.isMyStuffSearch).toBeFalsy();
    expect(mockStateService.setMyViewOrWorldView).toHaveBeenCalledWith('world');
    expect(comp.showLocationBar).toHaveBeenCalledWith(false);
  });

  it('should escape apostrophes in search string', () => {
    <jasmine.Spy>(mockAppSettingsService.isConnectApp).and.returnValue(true);
    comp.ngOnInit();
    const filteredPinSearch = new PinSearchRequestParams('Phil%27s cool group!', null, undefined);
    mockPinService.emitPinSearchRequest.and.returnValue(true);

    comp.onSearch('Phil\'s cool group!');
    expect(mockPinService.emitPinSearchRequest).toHaveBeenCalledWith(filteredPinSearch);
  });

  it('It should set the placeholder text to "Address..." on CONNECT component init', () => {
    <jasmine.Spy>(mockAppSettingsService.isConnectApp).and.returnValue(true);
    comp.ngOnInit();
    expect(comp.placeholderTextForSearchBar).toBe(mockAppSettingsService.placeholderTextForSearchBar);
  });

  it('It should set the placeholder text to "Keyword..." on GROUPS component init', () => {
    <jasmine.Spy>(mockAppSettingsService.isConnectApp).and.returnValue(false);
    comp.ngOnInit();
    expect(comp.placeholderTextForSearchBar).toBe(mockAppSettingsService.placeholderTextForSearchBar);
  });

  it('It should show the "clear search" button if there is text in the search bar ', () => {
    mockStateService.searchBarText = 'lol';
    comp.ngOnInit();
    expect(comp.isSearchClearHidden ).toBe(false);
  });

  it('It NOT should show the "clear search" button if there is no text in the search bar ', () => {
    mockStateService.searchBarText = '';
    comp.ngOnInit();
    expect(comp.isSearchClearHidden ).toBe(true);
  });

  it('should call OnSearch 1 time', () => {
    spyOn(comp, 'onSearch');
    comp.shouldShowSubmit = true;
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(comp.onSearch).toHaveBeenCalledTimes(1);
    });
  });

  it('should toggle filters and shouldShowDialog if shouldShowDialog is false', () => {
    comp.shouldShowSubmit = false;
    spyOn(comp, 'showLocationBar');
    mockStateService.getIsFilteredDialogOpen.and.returnValue(false);
    comp.toggleFilters();
    expect(mockStateService.setIsFilterDialogOpen).toHaveBeenCalledWith(true);
    expect(comp.showLocationBar).toHaveBeenCalledWith(true);
  });

  it('should toggle filters only when shouldshow', () => {
    comp.shouldShowSubmit = true;
    spyOn(comp, 'showLocationBar');
    mockStateService.getIsFilteredDialogOpen.and.returnValue(false);
    comp.toggleFilters();
    expect(mockStateService.setIsFilterDialogOpen).toHaveBeenCalledWith(true);
    expect(comp.showLocationBar).not.toHaveBeenCalled();
  });

  it('should only toggle filters if onlyToggleFilters is true', () => {
    mockStateService.getIsFilteredDialogOpen.and.returnValue(true);
    comp.shouldShowSubmit = true;
    spyOn(comp, 'showLocationBar');
    comp.toggleFilters(true);
    expect(mockStateService.setIsFilterDialogOpen).toHaveBeenCalledWith(false);
    expect(comp.showLocationBar).not.toHaveBeenCalled();
  });

  it('should toggleLocationBar if in group mode', () => {
    comp.isConnectApp = false;
    comp.shouldShowSubmit = false;
    comp.showLocationBar(true);
    expect(comp.shouldShowSubmit).toBe(true);
  });

  it('should not toggleLocationBar if in connect mode', () => {
    comp.isConnectApp = true;
    comp.shouldShowSubmit = false;
    comp.showLocationBar(true);
    expect(comp.shouldShowSubmit).toBe(false);
  });

  it('filterCancel should hide location bar', () => {
    comp.isConnectApp = false;
    comp.shouldShowSubmit = true;
    comp.filterCancel();
    expect(comp.shouldShowSubmit).toBe(false);
  });

  it('should hideLocationBar', () => {
    comp.shouldShowSubmit = true;
    comp.hideLocationBar();
    expect(comp.shouldShowSubmit).toBe(false);
  });
});
