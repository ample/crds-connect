/* tslint:disable:no-unused-variable */

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';

import { ContentBlockModule } from 'crds-ng2-content-block';
import { ContentService } from '../../services/content.service';
import { NoResultsComponent } from './no-results.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('Component: NoResults', () => {
  let debug: DebugElement;
  let element: HTMLElement;

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

    debug = this.fixture.debugElement.query(By.css('.btn'));
    element = debug.nativeElement;

  });

  it('should create an instance', () => {
      expect(this.component).toBeTruthy();
  });

  it('should navigate to add me to map on button click', inject([Router], (router: Router) => {
    const spy = spyOn(router, 'navigateByUrl');
    element.click();
    const navArgs = spy.calls.first().args[0];
    expect(navArgs).toMatch('/add-me-to-the-map');
  }));

});
