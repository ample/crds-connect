/* tslint:disable:no-unused-variable */

import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule } from '@angular/http';
import { Router } from '@angular/router';
import { TestBed, inject } from '@angular/core/testing';

import { ContentService } from '../../services/content.service';
import { GettingStartedComponent } from './getting-started.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('Component: Getting Started', () => {
  let router: Router;
  let debug: DebugElement;
  let element: HTMLElement;

  beforeEach(() => {
    class RouterStub {
      navigate(url: string) { return url; }
    }

    TestBed.configureTestingModule({
      declarations: [
        GettingStartedComponent
      ],
      imports: [ HttpModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        ContentService,
        { provide: Router, useClass: RouterStub }
      ]
    });

    this.fixture = TestBed.createComponent(GettingStartedComponent);
    this.component = this.fixture.componentInstance;

    debug = this.fixture.debugElement.query(By.css('.btn'));
    element = debug.nativeElement;
    this.fixture.detectChanges();

  });

  it('should create an instance', () => {
    expect(this.component).toBeTruthy();
  });

  it('should call the router to navigate', inject([Router], (router: Router) => {
        const spy = spyOn(router, 'navigate');
        element.click();
        const navArgs = spy.calls.first().args[0];

        expect(navArgs).toBeTruthy();
  }));

});




