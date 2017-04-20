/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';

import { ContentBlockModule } from 'crds-ng2-content-block';
import { ContentService } from 'crds-ng2-content-block/src/content-block/content.service';
import { StateService } from '../../services/state.service';
import { NoResultsComponent } from './no-results.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../shared/mock.component';

describe('Component: NoResults', () => {
  let mockContentService;

  beforeEach(() => {
    mockContentService = jasmine.createSpyObj<ContentService>('content', ['loadData']);

    class RouterStub {
      navigateByUrl(url: string) { return url; }
    }

    TestBed.configureTestingModule({
      declarations: [
        NoResultsComponent,
        MockComponent({selector: 'crds-content-block', inputs: ['id']})
      ],
      imports: [ HttpModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        StateService,
        { provide: ContentService, useValue: mockContentService },
        { provide: Router, useClass: RouterStub }
      ]
    });

    this.fixture = TestBed.createComponent(NoResultsComponent);
    this.component = this.fixture.componentInstance;
  });

  it('should create an instance', () => {
      expect(this.component).toBeTruthy();
  });

  it('should navigate to neighbors on button click', inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigateByUrl');
      this.component.btnClickBack();
      const navArgs = spy.calls.first().args[0];
      expect(navArgs).toMatch('/');
  }));

  it('should navigate to add me to map on button click', inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigateByUrl');
      this.component.btnClickAddToMap();
      const navArgs = spy.calls.first().args[0];
      expect(navArgs).toMatch('/add-me-to-the-map');
  }));

});
