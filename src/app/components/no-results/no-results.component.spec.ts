/* tslint:disable:no-unused-variable */

import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';

import { ContentBlockModule } from 'crds-ng2-content-block';
import { ContentService } from '../../services/content.service';
import { NoResultsComponent } from './no-results.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('Component: NoResults', () => {

  beforeEach(() => {
    class RouterStub {
      navigateByUrl(url: string) { return url; }
    }

    TestBed.configureTestingModule({
      declarations: [
        NoResultsComponent
      ],
      imports: [ HttpModule,
        RouterTestingModule.withRoutes([]),
        ContentBlockModule.forRoot({ categories: ['common'] })
      ],
      providers: [
        ContentService,
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
      expect(navArgs).toMatch('/neighbors');
  }));

  it('should navigate to add me to map on button click', inject([Router], (router: Router) => {
      const spy = spyOn(router, 'navigateByUrl');
      this.component.btnClickAddToMap();
      const navArgs = spy.calls.first().args[0];
      expect(navArgs).toMatch('/add-me-to-the-map');
  }));

});
