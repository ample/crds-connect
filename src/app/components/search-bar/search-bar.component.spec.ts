import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { PinSearchRequestParams } from '../../models/pin-search-request-params';
import { PinService } from '../../services/pin.service';
import { StateService } from '../../services/state.service';
import { SearchBarComponent } from './search-bar.component';

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
  let mockPinService, mockStateService;

  beforeEach(() => {
    mockPinService = jasmine.createSpyObj<PinService>('pinService', ['emitPinSearchRequest']);
    mockStateService = new StateServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        SearchBarComponent
      ],
      providers: [
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
    let pinSearch = new PinSearchRequestParams(true, 'Phil is cool!');
    mockPinService.emitPinSearchRequest.and.returnValue(true);
    comp.onSearch(pinSearch.userSearchString);
    expect(mockPinService.emitPinSearchRequest).toHaveBeenCalledWith(pinSearch);
    expect(comp.isMyStuffSearch).toBeFalsy();
    expect(mockStateService.setMyViewOrWorldView).toHaveBeenCalledWith('world');
  });
});
