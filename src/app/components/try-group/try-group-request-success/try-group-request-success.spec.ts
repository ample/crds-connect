import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../../shared/mock.component';
import { Observable } from 'rxjs/Rx';

import {TryGroupRequestSuccessComponent} from './try-group-request-success.component';



let fixture: ComponentFixture<TryGroupRequestSuccessComponent>;
let comp: TryGroupRequestSuccessComponent;
let mockRouter;
let route;

describe('TryGroupRequestSuccessComponent', () => {
  beforeEach(() => {

    mockRouter = {
      url: '/small-group/1234', routerState:
      { snapshot: { url: '/small-group/1234' } }, navigate: jasmine.createSpy('navigate')
    };

    route = new ActivatedRoute();
    route.snapshot = new ActivatedRouteSnapshot();
    route.snapshot.params = { groupId: '1234' };

    TestBed.configureTestingModule({
      declarations: [
        TryGroupRequestSuccessComponent,
      ],
      imports: [],
      providers: [
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { groupId: 1234 } } }, // this passes
          // useValue: route, // this fails?
         },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TryGroupRequestSuccessComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should create an instance', () => {
      expect(comp).toBeTruthy();
  });

  it('Navigates to the group details when close ("x") is clicked', () => {
    mockRouter = {
      url: '/small-group/1234', routerState:
      { snapshot: { url: '/small-group/1234' } }, navigate: jasmine.createSpy('navigate')
    };
    // mockRouter.routerState.snapshot.url = '/small-group/1234';
    mockRouter.routerState.snapshot.params = { snapshot: { params: { groupId: 1234 } } };
    //route.snapshot.params = { groupId: '1234' };

    comp.groupId = '1234';  // TODO need to get this from route params instead??
    comp.onClose();
    expect(comp['router'].navigate).toHaveBeenCalledWith(['/small-group/1234']);
  });

  it('Navigates to the group details when "Back to group" is clicked', () => {
    comp.groupId = '1234';  // TODO need to get this from route params instead??
    comp.onBackToGroup();
    expect(comp['router'].navigate).toHaveBeenCalledWith(['/small-group/1234']);
  });

  it('Navigates to search when "Find another group" is clicked', () => {
    comp.onFindAnotherGroup();
    expect(comp['router'].navigate).toHaveBeenCalledWith(['/']);
  });

});







