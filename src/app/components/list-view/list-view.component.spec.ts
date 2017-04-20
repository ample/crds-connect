/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { ListViewComponent } from './list-view.component';
import { ListEntryComponent } from '../list-entry/list-entry.component';
import { MapContentComponent } from '../../components/map-content/map-content.component';
import { MapFooterComponent } from '../map-footer/map-footer.component';
import { NeighborsHelperService } from '../../services/neighbors-helper.service';
import { ContentBlockModule } from 'crds-ng2-content-block';
import { SessionService } from '../../services/session.service';
import { StateService } from '../../services/state.service';
import { ListHelperService } from '../../services/list-helper.service';
import { ListFooterComponent } from '../../components/list-footer/list-footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BlandPageService } from '../../services/bland-page.service';
import { MockComponent } from '../../shared/mock.component';

describe('Component: List View', () => {
  let mockStateService,
    mockListHelperService,
    mockCookieService,
    mockNeighborsHelperService,
    mockBlandPageService,
    mockSessionService;

  beforeEach(() => {
    mockStateService= jasmine.createSpyObj<StateService>('stateService', ['constructor', 'setShowingPinCount', 'getShowingPinCount']);
    mockListHelperService= jasmine.createSpyObj<ListHelperService>('listHelperService', ['constructor']);
    mockNeighborsHelperService= jasmine.createSpyObj<NeighborsHelperService>('neighborhoodHelperService', ['constructor']);
    mockBlandPageService= jasmine.createSpyObj<BlandPageService>('blandPageService', ['constructor']);
    mockSessionService= jasmine.createSpyObj<SessionService>('sessionService', ['constructor']);

    TestBed.configureTestingModule({
      declarations: [
        ListViewComponent,
        ListEntryComponent,
        ListFooterComponent,
        MockComponent({selector: 'profile-picture', inputs: ['contactId', 'wrapperClass', 'imageClass']}),
        MockComponent({selector: 'crds-content-block', inputs: ['id']})
      ],
      imports: [
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: StateService, useValue: mockStateService },
        { provide: ListHelperService, useValue: mockListHelperService },
        { provide: NeighborsHelperService, useValue: mockNeighborsHelperService },
        { provide: BlandPageService, useValue: mockBlandPageService },
        { provide: SessionService, useValue: mockSessionService }
      ]
    });
    this.fixture = TestBed.createComponent(ListViewComponent);
    this.component = this.fixture.componentInstance;

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  describe('paging values', () => {
    it('should be set up to increment by 10', () => {
      expect(this.component.showing_increment).toEqual(10);
    });
  });
 
});
