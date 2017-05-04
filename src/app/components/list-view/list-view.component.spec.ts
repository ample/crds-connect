import { Pin } from '../../models/pin';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { StateService } from '../../services/state.service';
import { MockComponent } from '../../shared/mock.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListViewComponent } from './list-view.component';

describe('ListViewComponent', () => {
  let fixture: ComponentFixture<ListViewComponent>;
  let comp: ListViewComponent;
  let el;
  let mockStateService, mockNeighborsHelperService;

  beforeEach(() => {
    mockStateService = { setShowingPinCount: jest.fn(), getShowingPinCount: jest.fn(), getMyViewOrWorldView: jest.fn() };
    mockNeighborsHelperService = { changeEmitter: { subscribe: jest.fn() } };
    TestBed.configureTestingModule({
      declarations: [
        ListViewComponent,
        MockComponent({
          selector: 'list-entry', inputs: ['firstName', 'lastName', 'siteName', 'type',
            'proximity', 'description', 'groupId', 'address', 'participantId', 'participantCount', 'contactId']
        }),
        MockComponent({ selector: 'list-footer', inputs: ['pins'] }),
        MockComponent({ selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass'] }),
        MockComponent({ selector: 'crds-content-block', inputs: ['id'] })
      ],
      providers: [
        { provide: StateService, useValue: mockStateService },
        { provide: NeighborsHelperService, useValue: mockNeighborsHelperService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ListViewComponent);
      comp = fixture.componentInstance;

      // el = fixture.debugElement.query(By.css('h1'));
    });
  }));

  it('should create an instance', () => {
    fixture.detectChanges();
    expect(comp).toBeTruthy();
  });

  it('should return empty array of pins when searchResults undefined' , () => {
    expect(comp.pinsToShow()).toEqual(new Array<Pin>());
  });

  describe('paging values', () => {
    it('should be set up to increment by 10', () => {
      expect(comp.showing_increment).toEqual(10);
    });
  });
});
